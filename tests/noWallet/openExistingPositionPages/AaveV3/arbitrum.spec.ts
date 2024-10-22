import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Aave v3 Arbitrum', async () => {
	test('It should open an existing Aave V3 Arbitrum Earn yield multiple RETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/RETH-ETH/540#overview');

		await app.position.shouldHaveHeader('RETH/ETH yield multiple #540');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9].[0-9]{2}',
		});
	});

	test('It should open an existing Aave V3 Arbitrum Borrow ETH/DAI position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11993',
		});

		await app.page.goto('/arbitrum/aave/v3/borrow/eth-dai/1#overview');

		await app.position.shouldHaveHeader('ETH/DAI Multiply #1');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[1-2],[0-9]{3}.[0-9]{2}',
			token: 'ETH/DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('[3-9][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{1,2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveMultiple('[1-8].[0-9]{1,2}');
		await app.position.overview.shouldHaveBorrowRate('[0-9]{1,2}.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			pair: 'ETH/DAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[2-9][0-9].[0-9]{1,2}');
	});

	test('It should open an existing Aave V3 Arbitrum Multiply DAI/WBTC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/DAI-WBTC/2#overview');

		await app.position.shouldHaveHeader('DAI/WBTC Multiply #2');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
	});
});
