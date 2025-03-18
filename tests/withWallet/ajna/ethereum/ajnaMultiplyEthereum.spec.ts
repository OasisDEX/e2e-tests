import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Ajna Ethereum Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		await setup({ metamask, app, network: 'mainnet', withoutFork: true });
	});

	test('It should allow to simulate an Ajna Ethereum Multiply position before opening it', async () => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/WBTC-DAI#setup');
		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'WBTC', amount: '0.654321' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-9]{1,2},[0-9]{3}.[0-9]{2} WBTC/DAI'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[0-1].[0-9]{3,4}',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})? WBTC/DAI',
		});
		// Ajna LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '0.[0-9]{4}',
			token: 'WBTC',
			dollarsAmount: '[1-9],[0-9]{3}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WBTC',
			current: '0.00',
			future: '[0-1].[0-9]{3,4}',
		});
		// SKIP - Price impact returning "n/a"
		// await app.position.setup.orderInformation.shouldHavePriceImpact({
		// 	amount: '[2-9][0-9],[0-9]{3}.[0-9]{2}',
		// 	percentage: '[0-9].[0-9]{2}',
		// 	protocol: 'Ajna',
		// 	pair: 'WBTC/DAI',
		// });
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.50');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'DAI',
			current: '0.00',
			future: '[1-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2}.[0-9]{2}',
			future: '[0-9]{2}.[0-9]{2}',
		});

		await test.step('It should allow to simulate risk adjustment (Up & Down) with slider', async () => {
			const initialLiqPrice = await app.position.manage.getLiquidationPrice();
			const initialLoanToValue = await app.position.manage.getLoanToValue('Ajna');

			// RISK UP
			await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WBTC/DAI' });

			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue('Ajna');
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

			// RISK DOWN
			await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.3 });

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WBTC/DAI' });

			const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Ajna');
			expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
			expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
		});
	});
});

// NO LIQUIDITY
test.describe.skip('Ajna Ethereum Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'WBTC',
			balance: '5',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	// NO LIQUIDITY
	test.skip('It should open an Ajna Ethereum Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/WBTC-DAI#setup');

		await app.position.setup.acknowledgeAjnaInfo();

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'WBTC', amount: '0.01' },
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'down',
				newSliderPosition: 0.05,
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'up',
				newSliderPosition: 0.1,
			});
		});

		await test.step('It should Close a position', async () => {
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				vtId,
				app,
				closeTo: 'collateral',
				collateralToken: 'WBTC',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '0.[0-9]{3,4}',
			});
		});
	});
});
