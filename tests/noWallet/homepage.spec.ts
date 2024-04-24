import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Homepage', async () => {
	test('It should open connect-wallet popup - Homepage', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12333',
		});

		test.setTimeout(longTestTimeout);

		await app.homepage.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should list Earn positions by default', async ({ app }) => {
		await app.homepage.productHub.header.positionType.shouldBe('earn');
	});

	// To be removed after 'Improved Product Discovery Experience' release
	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test.skip(`It should list only ${positionCategory} positions`, async ({ app }) => {
			test.setTimeout(longTestTimeout);

			await app.homepage.open();
			await app.homepage.productHub.header.positionType.select(positionCategory);
			await app.homepage.productHub.list.allPoolsShouldBe(positionCategory);
		})
	);

	// To be UPDATED after 'Improved Product Discovery Experience' release
	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test.skip(`It should link to ${positionCategory} page`, async ({ app }) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12334',
			});

			await app.homepage.open();
			await app.homepage.productHub.header.positionType.select(positionCategory);
			await app.homepage.productHub.shouldLinkTo(positionCategory);
		})
	);

	test('It should link to pool finder - Earn', async ({ app }) => {
		await app.homepage.open();
		await app.homepage.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});
});
