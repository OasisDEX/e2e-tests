import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Ajna Ethereum', async () => {
	test('It should open an existing Ajna Ethereum Earn active lending ETH/USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/ajna/earn/ETH-USDC/1474#overview');

		await app.position.shouldHaveHeader('ETH/USDC Earn #1474');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should open an existing Ajna Ethereum Borrow APXETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto(
			'/ethereum/ajna/borrow/0x9ba021b0a9b958b5e75ce9f6dff97c7ee52cb3e6-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/1467#overview'
		);

		await app.position.shouldHaveHeader('APXETH/ETH Borrow #1467');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9].[0-9]{4}',
			token: 'APXETH/ETH',
			timeout: positionTimeout,
		});
	});

	test('It should open an existing Ajna Ethereum Multiply USDC/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/USDC-ETH/1467#overview');

		await app.position.shouldHaveHeader('USDC/ETH Multiply #1467');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
	});
});
