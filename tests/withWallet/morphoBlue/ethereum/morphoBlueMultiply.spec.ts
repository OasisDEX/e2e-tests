import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '100',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage a Morpho Blue Multiply position - WSTETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WSTETH-USDC#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '10.12345' },
				protocol: 'Morpho Blue',
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.6,
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.5,
			});
		});

		await test.step('It should Close a position', async () => {
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				forkId,
				app,
				closeTo: 'collateral',
				collateralToken: 'WSTETH',
				debtToken: 'USDC',
				tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}',
			});
		});
	});
});

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		app = new App(page);
		await setup({ metamask, app, network: 'mainnet', withoutFork: true });
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should allow to simulate a Morpho Blue Multiply position before opening it @regression', async () => {
		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WSTETH-USDC#setup');
		await app.position.setup.deposit({ token: 'WSTETH', amount: '15.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-9]{3}.[0-9]{2} WSTETH/USDC'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})?',
			protocol: 'Morpho Blue',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '1[5-7].[0-9]{1,2}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
			protocol: 'Morpho Blue',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}(.[0-9]{1,2})? WSTETH/USDC',
		});
		// Morphho Blue LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-2].[0-9]{4}',
			token: 'WSTETH',
			dollarsAmount: '([1-9]{1,2},)?[0-9]{3}.[0-9]{2}',
			protocol: 'Morpho Blue',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WSTETH',
			current: '0.00',
			future: '1[5-7].[0-9]{1,2}',
		});
		// SKIP - Price impact returning "n/a"
		// await app.position.setup.orderInformation.shouldHavePriceImpact({
		// 	amount: '[1-5],[0-9]{3}.[0-9]{2}',
		// 	percentage: '[0-9].[0-9]{2}',
		// 	protocol: 'Morpho Blue',
		// 	pair: 'WSTETH/USDC',
		// });
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.50');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '[1-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
			protocol: 'Morpho Blue',
		});

		await test.step('It should allow to simulate risk adjustment (Up & Down) with slider', async () => {
			const initialLiqPrice = await app.position.manage.getLiquidationPrice();
			const initialLoanToValue = await app.position.manage.getLoanToValue('Morpho Blue');

			// RISK UP
			await app.position.setup.moveSlider({ protocol: 'Morpho', value: 0.5 });

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/USDC' });

			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue('Morpho Blue');
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

			// RISK DOWN
			await app.position.setup.moveSlider({ protocol: 'Morpho', value: 0.3 });

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/USDC' });

			const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Morpho Blue');
			expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
			expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
		});
	});
});
