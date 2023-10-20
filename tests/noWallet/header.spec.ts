import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Header', async () => {
	test('It should open connect-wallet popup - Header', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12336',
		});

		await app.homepage.open();
		await app.header.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	(['Swap', 'Bridge'] as const).forEach((productOption) =>
		test(`It should open connect-wallet popup - Header > Products > ${productOption}`, async ({
			app,
		}) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12338',
			});

			await app.homepage.open();
			await app.header.products.select({
				product: 'Swap & Bridge',
				menuOption: `${productOption} on Summer.fi`,
			});
			await app.modals.connectWallet.shouldBeVisible();
		})
	);

	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test(`It should link to ${positionCategory} page - Header > Products > ${positionCategory}`, async ({
			app,
		}) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12337',
			});

			await app.homepage.open();
			await app.header.products.shouldLinkTo(positionCategory);
		})
	);
});
