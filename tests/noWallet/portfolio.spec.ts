import { test } from '#noWalletFixtures';
import { testTimeout } from 'utils/config';

test.describe('Portfolio', async () => {
	test.skip('It should show no assets', async ({ app }) => {
		await app.portfolio.open('0x8Af4F3fbC5446a3fc0474859B78fA5f4554D4510');

		// TO DO
	});

	test('It should open existent Spark Earn Ethereum vault page @regression', async ({ app }) => {
		test.setTimeout(testTimeout);

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

	test('It should open existent Aave V3 Multiply Arbitrum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(testTimeout);

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

	test('It should open existent Aave V3 Borrow Optimism vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(testTimeout);

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
		await app.position.overview.shouldHaveBorrowCost('-[1-6].[0-9]{2}');
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

	test('It should open existent Aave V3 Multiply Ethereum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(testTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11995',
		});

		await app.page.goto('/ethereum/aave/v3/1218#overview');

		await app.position.shouldHaveHeader('Aave ETH/USDC');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveLoanToValue('[2-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('0.[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCostGreaterThanZero();
		await app.position.overview.shouldHaveNetValue({ value: '[1-8].[0-9]{2}', token: 'USDC' });
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{5}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[4-9].[0-9]{4}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveMultiple('[1-3].[0-9]{1,2}');
		await app.position.overview.shouldHaveBuyingPower('[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}.[0-9]{2}',
			pair: 'USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[5-9][0-9].[0-9]');
	});

	test('It should open existent Maker Multiply Ethereum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(testTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11997',
		});

		await app.page.goto('/ethereum/maker/10187#overview');

		await app.position.shouldHaveHeader('ETH-A Vault 10187');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9]{3}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveBuyingPower('[0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '[0-9]{2,3}.[0-9]{2}' });
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveTotalCollateral({
			amount: '0.[0-3][1-9][0-9]{2}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultiple('1.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}.[0-9]{2}',
		});
		await app.position.manage.shouldHaveCollateralRatio('[0-9]{3,4}');
	});
});
