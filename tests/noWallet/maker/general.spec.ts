import { test } from '#noWalletFixtures';

test.describe('Maker', async () => {
	(
		[
			{ positionCategory: 'Borrow', url: '/vaults/open/ETH-C' },
			{ positionCategory: 'Earn', url: '/earn/dsr' },
			{ positionCategory: 'Multiply', url: '/vaults/open-multiply/ETH-B' },
		] as const
	).forEach(({ positionCategory, url }) =>
		test(`It should trigger 'Connect wallet' popup when opening a ${positionCategory} Maker position page`, async ({
			app,
		}) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12335',
			});

			await app.page.goto(url);
			await app.modals.connectWallet.shouldBeVisible();
		})
	);
});
