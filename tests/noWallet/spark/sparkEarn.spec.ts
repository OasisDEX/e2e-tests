import { expect, test } from '#noWalletFixtures';
import { veryLongTestTimeout } from 'utils/config';

test.describe('Spark Earn', async () => {
	test('It should open an existing Spark Earn Ethereum vault page @regression', async ({ app }) => {
		test.setTimeout(veryLongTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11991',
		});

		await expect(async () => {
			await app.page.goto('/ethereum/spark/multiply/wsteth-eth/1417#overview');
			await app.position.overview.shouldBeVisible();
		}).toPass();

		await app.position.shouldHaveHeader('WSTETH/ETH Multiply #1417');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9].[0-9]{2}([0-9]{1,2})?',
			token: 'WSTETH/ETH',
		});
		await app.position.overview.shouldHaveLiquidationPriceGreaterThanZero('WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValue('[2-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{1,2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{2,3}.[0-9]{1,2}');
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
		await app.position.overview.shouldHaveBorrowRate('[0-5].[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-1].[0-9]{4}',
			pair: 'WSTETH/ETH',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-9][0-9].[0-9]{2}');
	});
});
