import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'base',
				walletAddress,
				token: 'USDC',
				balance: '100000',
			});
		});

		await app.page.goto('/base/ajna/multiply/ETH-USDC');
		await app.position.setup.acknowlegeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '15' },
			protocol: 'Ajna',
		});
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.15,
		});
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.15,
		});
	});

	test('It should Close to debt an existing Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await close({
			forkId,
			app,
			closeTo: 'debt',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '[0-9]{2},[0-9]{3}.[0-9]{1,2}',
		});
	});

	test('It should allow to simulate an Ajna Base Multiply position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.page.goto('/base/ajna/multiply/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '15.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{4} WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		// !! Skipped for now - Waiting for confirmation about validity of extremely high value displayed at the moment
		// await app.position.overview.shouldHaveBuyingPowerAfterPill({
		// 	amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
		// 	protocol: 'Ajna',
		// });
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '1[5-9].[0-9]{1,2}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-2].[0-9]{3,4}',
			token: 'ETH',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]{3,4} WSTETH/ETH',
		});
		// Ajna LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-2].[0-9]{4}',
			token: 'WSTETH',
			dollarsAmount: '[1-9],[0-9]{3}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WSTETH',
			current: '0.00',
			future: '1[5-7].[0-9]{1,2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-2].[0-9]{3,4}',
			percentage: '[0-9].[0-9]{2}',
			protocol: 'Ajna',
			pair: 'WSTETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.05');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '[1-2].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2}.[0-9]{2}',
			future: '[0-9]{2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate risk adjustment (Up & Down) with slider in an Ajna Base Multiply position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue('Ajna');

		// RISK UP
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/ETH' });

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.3 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/ETH' });

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});
});
