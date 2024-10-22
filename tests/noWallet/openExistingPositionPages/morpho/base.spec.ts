import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Morpho Base', async () => {
	test('It should open an existing Morpho Base Earn yield multiple WEETH-ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/morphoblue/multiply/WEETH-ETH/500#overview');

		await app.position.shouldHaveHeader('WEETH/ETH yield multiple #500');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should open an existing Morpho Base Borrow CBETH-USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/morphoblue/borrow/CBETH-USDC/554#overview');

		await app.position.shouldHaveHeader('CBETH/USDC Borrow #554');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'CBETH/USDC',
			timeout: positionTimeout,
		});
	});

	test('It should open an existing Morpho Base Multiply ETH-USDC position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/morphoblue/multiply/ETH-USDC/500#overview');

		await app.position.shouldHaveHeader('ETH/USDC Multiply #500');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'ETH/USDC',
			timeout: positionTimeout,
		});
	});
});
