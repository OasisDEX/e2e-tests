import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Ajna Base', async () => {
	test('It should open an existing Ajna Base Earn active lending WSTETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/ajna/earn/WSTETH-ETH/16#overview');

		await app.position.shouldHaveHeader('WSTETH/ETH Earn #16');
		await app.position.overview.shouldHaveNetValue({
			value: '0.00',
		});
	});

	test('It should open an existing Ajna Base Borrow PRIME/USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/ajna/borrow/PRIME-USDC/423#overview');

		await app.position.shouldHaveHeader('PRIME/USDC Borrow #423');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'PRIME/USDC',
			timeout: positionTimeout,
		});
	});

	test('It should open an existing Ajna Base Multiply ETH/USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/ajna/multiply/ETH-USDC/435#overview');

		await app.position.shouldHaveHeader('ETH/USDC Multiply #435');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([0-9],)?[0-9]{3}.[0-9]{2}',
			token: 'ETH/USDC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('[0-9]{1,2}.[0-9]{2}');
	});
});
