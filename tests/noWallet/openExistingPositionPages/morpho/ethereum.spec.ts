import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Morpho Ethereum', async () => {
	test('It should open an existing Morpho Ethereum Earn Steakhouse USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/erc-4626/earn/steakhouse-USDC/1467#overview');

		await app.position.shouldHaveHeader('Steakhouse USDC #1467');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should open an existing Morpho Ethereum Borrow WSTETH-ETH-1 position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/morphoblue/borrow/WSTETH-ETH-1/1467#overview');

		await app.position.shouldHaveHeader('WSTETH/ETH 94.50% Borrow #1467');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9].[0-9]{4}',
		});
	});

	test('It should open an existing Morpho Ethereum WBTC-USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WBTC-USDC/1467#overview');

		await app.position.shouldHaveHeader('WBTC/USDC Multiply #1467');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
		});
	});
});
