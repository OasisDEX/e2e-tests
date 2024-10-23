import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

test.describe.configure({ mode: 'serial' });

// NO LIQUIDITY
test.describe.skip('Ajna Base Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Base Multiply position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({ app, network: 'base', withoutFork: true });
		});

		await app.page.goto('/base/ajna/multiply/SNX-USDC#setup');
		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'SNX', amount: '10000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{4} SNX/USDC');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2,3},[0-9]{3}(.[0-9]{1,2})?',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
			token: 'SNX',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-7],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]{3,4} SNX/USDC',
		});
		// Ajna LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '([1-3],)?[0-9]{3}.[0-9]{2}',
			token: 'SNX',
			dollarsAmount: '[1-9],[0-9]{3}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'SNX',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-8].[0-9]{3,4}',
			percentage: '[0-9].[0-9]{2}',
			protocol: 'Ajna',
			pair: 'SNX/USDC',
		});
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.50');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '([1-7],)?[0-9]{3}.[0-9]{2}',
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
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'SNX/USDC' });

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.3 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'SNX/USDC' });

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});
});
