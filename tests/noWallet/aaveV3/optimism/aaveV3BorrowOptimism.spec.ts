import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Optimism', async () => {
	test('It should open an existing Aave V3 Borrow Optimism vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11994',
		});

		await app.page.goto('/optimism/omni/aave/v3/borrow/dai-wbtc/4#overview');

		await app.position.shouldHaveHeader('DAI/WBTC Borrow #4');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '<0.001',
			token: 'WBTC/DAI',
		});
		// BUG 14860
		// await app.position.overview.shouldHaveLoanToValue('[0-9]{2,3}.[0-9]{2}');
		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '<0.001',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '<0.001',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveBorrowRate('-[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '-0.[0-9]{1,2}' });
	});
});
