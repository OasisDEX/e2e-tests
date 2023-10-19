import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Homepage', async () => {
	test('It should list Earn positions by default', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.homepage.open();
		await app.homepage.productHub.header.position.shouldBe('Earn');
		await app.homepage.productHub.list.allPoolsShouldBe('Earn');
	});

	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test(`It should list only ${positionCategory} positions`, async ({ app }) => {
			await app.homepage.open();
			await app.homepage.productHub.header.position.select(positionCategory);
			await app.homepage.productHub.list.allPoolsShouldBe(positionCategory);
		})
	);

	// !!! Test skipped until Ajna products are enabled back
	test.skip('It should link to pool finder - Earn', async ({ app }) => {
		await app.homepage.open();
		await app.homepage.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});
});
