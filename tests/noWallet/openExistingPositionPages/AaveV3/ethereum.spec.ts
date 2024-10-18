import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Aave v3 Ethereum', async () => {
	test('It should open an existing Aave V3 Ethereum Earn yield multiple WSTETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/WSTETH-ETH/193#overview');

		await app.position.shouldHaveHeader('WSTETH/ETH yield multiple #193');
		await app.position.overview.shouldHaveNetValue({
			value: '0.00',
		});
	});

	test('It should open an existing Aave V3 Ethereum Borrow CBETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/borrow/CBETH-ETH/1277#overview');

		await app.position.shouldHaveHeader('CBETH/ETH Borrow #1277');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.[0-9]{4}',
			token: 'CBETH/ETH',
		});
		await app.position.overview.shouldHaveLoanToValue('[0-9]{1,2}.[0-9]{2}');
	});

	test('It should open an existing Aave V3 Ethereum Multiply ETH/USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		await app.position.shouldHaveHeader('ETH/USDC Multiply #1218');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([1-3],)?[0-9]{3}.[0-9]{2}',
			token: 'ETH/USDC',
		});
		await app.position.overview.shouldHaveLoanToValue('[1-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{2,3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveBorrowRate('[0-9].[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '([1-3],)?[0-9]{2,3}.[0-9]{2}',
			pair: 'ETH/USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[0-9]{1,2}.[0-9]{1,2}');
	});
});
