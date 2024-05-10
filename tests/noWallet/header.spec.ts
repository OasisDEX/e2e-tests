import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Header', async () => {
	test('It should open connect-wallet popup - Header', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12336',
		});

		test.setTimeout(longTestTimeout);

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

			test.setTimeout(longTestTimeout);

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

			test.setTimeout(longTestTimeout);

			await app.homepage.open();
			await app.header.products.shouldLinkTo(positionCategory);
		})
	);

	// To be UPDATED after 'Improved Product Discovery Experience' release
	(
		[
			{ protocol: 'Aave', product: 'Borrow' },
			{ protocol: 'Aave', product: 'Multiply' },
			{ protocol: 'Aave', product: 'Earn' },
			{ protocol: 'Maker', product: 'Borrow' },
			{ protocol: 'Maker', product: 'Multiply' },
			{ protocol: 'Maker', product: 'Earn' },
			{ protocol: 'Spark', product: 'Borrow' },
			{ protocol: 'Spark', product: 'Multiply' },
			{ protocol: 'Spark', product: 'Earn' },
		] as const
	).forEach(({ protocol, product }) =>
		test.skip(`It should open ${product} page and list only ${protocol} ${product} positions`, async ({
			app,
		}) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12340',
			});

			test.setTimeout(longTestTimeout);

			await app.homepage.open();
			await app.header.protocols.select({ protocol, product });
			await app.borrow.productHub.header.positionType.shouldBe(product);
			// await app.borrow.productHub.list.allPoolsShouldBe(product);
		})
	);
});
