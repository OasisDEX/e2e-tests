import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Arbitrum', async () => {
	test('It should open existent Aave V3 Multiply Arbitrum vault page @regression', async ({
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
			token: 'DAI',
		});
		await app.position.overview.shouldHaveLoanToValue('[3-9][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCostGreaterThanZero();
		await app.position.overview.shouldHaveNetValue({ value: '[1-2].[0-9]{2}', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{5}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[3-9].[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveMultiple('[2-8].[0-9]{1,2}');
		await app.position.overview.shouldHaveBuyingPower('[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}.[0-9]{2}',
			pair: 'DAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[5-9][0-9].[0-9]');
	});
});
