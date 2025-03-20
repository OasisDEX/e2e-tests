import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Aave v3 Optimism', async () => {
	test('It should open an existing Aave V3 Optimism Earn yield loop USDC.E/SUSD position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/USDC.E-SUSD/396#overview');

		await app.position.shouldHaveHeader('USDC.E/SUSD Multiply #396');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9].[0-9]{2}',
		});
	});

	test('It should open an existing Aave V3 Optimism Borrow DAI/WBTC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11994',
		});

		await app.position.openPage('/optimism/aave/v3/borrow/dai-wbtc/4#overview');

		await app.position.shouldHaveHeader('DAI/WBTC Borrow #4');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'WBTC/DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '<0.001',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '0.00',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveBorrowRate('[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '<0.01' });
	});

	test('It should open an existing Aave V3 Multiply Optimism WBTC/USDC.E position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/WBTC-USDC.E/19#overview');

		await app.position.shouldHaveHeader('WBTC/USDC.E Multiply #19');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			token: 'WBTC/USDC.E',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('[0-9]{1,2}.[0-9]{2}');
	});
});
