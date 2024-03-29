import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';

test.describe('Spark Earn', async () => {
	test('It should allow to simulate a Spark Earn position before opening it - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12581',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '21.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}([0-9]{1,2})?');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-5][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[0-9]{2}.[0-9]{2}([0-9]{1,2})?',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[2-9].[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBorrowRateAfterPill('[0-5].[0-9]{2}%');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]{3,4} ETH',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[2-8].[0-9]{5}',
			token: 'WSTETH',
			dollarsAmount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveFlashloanAmount({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-2].[0-9]{4}',
			percentage: '0.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'ETH',
			current: '0.00000',
			future: '[2-9].[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WSTETH',
			current: '0.00000',
			future: '[0-9]{2}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-5][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '0',
		});
	});

	test('It should allow to simulate a Spark Earn position before opening it - Adjust risk - Up and Down  - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12713',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/earn/retheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'RETH', amount: '60.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]{3,4} ETH',
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
			amount: '0.[0-9]{3,4} ETH',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
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
			amount: '0.[0-9]{3,4} ETH',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should open an existing Spark Earn Ethereum vault page @regression', async ({ app }) => {
		test.setTimeout(veryLongTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11991',
		});

		await expect(async () => {
			await app.page.goto('/ethereum/spark/v3/1417');
			await app.position.overview.shouldBeVisible();
		}).toPass();

		await app.position.shouldHaveHeader('Spark WSTETH/ETH');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9].[0-9]{2}([0-9]{1,2})?',
			token: 'WSTETH/ETH',
		});
		await app.position.overview.shouldHaveLiquidationPriceGreaterThanZero('ETH');
		await app.position.overview.shouldHaveLoanToValue('[2-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{1,2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{1,2}.[0-9]{1,2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('WSTETH');
		await app.position.overview.shouldHaveDebt({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultiple('[1-2].[0-9]{1,2}');
		await app.position.overview.shouldHaveBorrowRate('[1-5].[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({ amount: '[0-1].[0-9]{4}', pair: 'ETH' });
		await app.position.setup.shouldHaveLoanToValue('[1-9][0-9].[0-9]');
	});
});
