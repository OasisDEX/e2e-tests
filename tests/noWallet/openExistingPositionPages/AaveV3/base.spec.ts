import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Aave v3 Base', async () => {
	test('It should open an existing Aave V3 Base Earn yield loop CBETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/base/aave/v3/earn/CBETH-ETH/376#overview');

		await app.position.shouldHaveHeader('CBETH/ETH yield multiple #376');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9].[0-9]{2}',
		});
	});

	test('It should open an existing Aave V3 Base Borrow ETH/USDBC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/base/aave/v3/borrow/ETH-USDBC/441#overview');

		await app.position.shouldHaveHeader('ETH/USDBC Borrow #441');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'ETH/USDBC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
	});

	test('It should open an existing Aave V3 Base Multiply ETH/USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/base/aave/v3/multiply/ETH-USDC/435#overview');

		await app.position.shouldHaveHeader('ETH/USDC Multiply #435');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([0-9],)[0-9]{2,3}.[0-9]{2}',
			token: 'ETH/USDC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('[0-9]{2}.[0-9]{2}');
	});
});
