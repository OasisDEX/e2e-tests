import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Optimism', async () => {
	test('It should open existent Aave V3 Borrow Optimism vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11994',
		});

		await app.page.goto('/optimism/aave/v3/4');

		await app.position.shouldHaveHeader('Aave DAI/WBTC');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[1-8][0-9],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveLoanToValue('[3-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('-[1-9]?[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '0.[5-9][0-9]', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({
			amount: '[1-2].[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '0.0000',
			token: 'WBTC',
		});
	});
});
