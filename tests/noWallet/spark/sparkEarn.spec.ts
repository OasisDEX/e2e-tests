import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Spark Earn', async () => {
	test('It should open existent Spark Earn Ethereum vault page @regression', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11991',
		});
		await app.page.goto('/ethereum/spark/v3/1417#overview');

		await app.position.shouldHaveHeader('Spark WSTETH/ETH');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9].[0-9]{2}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveLiquidationPriceGreaterThanZero('ETH');
		await app.position.overview.shouldHaveLoanToValue('[2-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('[1-5].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '0.0[1-4]', token: 'ETH' });
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{5}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('WSTETH');
		await app.position.overview.shouldHaveDebt({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveDebtGreaterThanZero('ETH');
		await app.position.overview.shouldHaveMultiple('1.[0-9]{1,2}');
		await app.position.overview.shouldHaveBuyingPower('[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();

		await app.position.setup.shouldHaveLiquidationPrice({ amount: '[0-1].[0-9]{4}', pair: 'ETH' });
		await app.position.setup.shouldHaveLoanToValue('[1-9][0-9].[0-9]');
	});
});
