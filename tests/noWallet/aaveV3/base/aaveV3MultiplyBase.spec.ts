import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Base', async () => {
	test('It should allow to simulate an Aave V3 Base Multiply position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12454',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/cbethusdbc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'CBETH', amount: '19.6543' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-9][0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-5][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveBorrowRateAfterPill('[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('1[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[1-5][0-9].[0-9]{5}',
			token: 'CBETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{4}',
			token: 'USDBC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9][0-9]{2}(.[0-9]{1,2})? USDBC',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-9].[0-9]{5}',
			token: 'CBETH',
			dollarsAmount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveFlashloanAmount({
			amount: '[0-9]{1,2}.[0-9]{5}',
			token: 'WETH',
		});
		await app.position.setup.orderInformation.shouldHaveFlashloanProviderLiquidity({
			amount: '[0-9]{3,4}.[0-9]{5}',
			token: 'WETH',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-6],[0-9]{3}.[0-9]{2}',
			percentage: '[0-6].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDBC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'CBETH',
			current: '0.00000',
			future: '[0-9]{2}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDBC',
		});
	});

	test('It should allow to simulate an Aave V3 Base Multiply position before opening it - Adjust risk - Up and Down  - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12597',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/ethusdbc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3}.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}(.[0-9]{1,2})? USDBC',
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
			amount: '([0-9],)?[0-9]{3}(.[0-9]{1,2})? USDBC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('([0-9],)?[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.1 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}(.[0-9]{1,2})? USDBC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});
});
