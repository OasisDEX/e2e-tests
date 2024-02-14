import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Arbitrum', async () => {
	test('It should allow to simulate an Aave V3 Arbitrum Multiply position before opening it - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12332',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/daiwbtc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'DAI', amount: '6000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-4][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[2-9],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '\\$[1-9],[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '0.[0-9]{4}',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.overview.shouldHaveBorrowRateAfterPill('-[0-9]{1,2}.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{2,3},[0-9]{3}(.[0-9]{1,2})? DAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '1,[0-9]{3}.[0-9]{4}',
			token: 'DAI',
			dollarsAmount: '1,[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-7][0-9],[0-9]{3}.[0-9]{2}',
			percentage: '0.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'WBTC',
			current: '0.00',
			future: '0.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'DAI',
			current: '0.0000',
			future: '[4-9],[0-9]{3}.[0-9]{4}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[1-5].[0-9]{4}',
			token: 'DAI',
		});
	});

	test('It should allow to simulate an Aave V3 Arbitrum Multiply position before opening it - Adjust risk - Up and Down - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12598',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/usdcwbtc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'USDC', amount: '20000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3},[0-9]{3}.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3},[0-9]{3}(.[0-9]{1,2})? USDC',
		});
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		// RISK UP
		await app.position.setup.moveSlider({ value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.1 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3},[0-9]{3}(.[0-9]{1,2})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeGreaterThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should open an existing Aave V3 Multiply Arbitrum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11993',
		});

		await app.page.goto('/arbitrum/aave/v3/1');

		await app.position.shouldHaveHeader('Aave ETH/DAI');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[1-2],[0-9]{3}.[0-9]{2}',
			token: 'ETH/DAI',
		});
		await app.position.overview.shouldHaveLoanToValue('[3-9][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{1,2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveMultiple('[1-8].[0-9]{1,2}');
		await app.position.overview.shouldHaveBorrowRate('[0-9]{1,2}.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			pair: 'DAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[3-9][0-9].[0-9]');
	});
});
