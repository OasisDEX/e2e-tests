import { test } from '#fixtures';

test.describe('Borrow', async () => {
	test('It should list only Borrow positions', async ({ app }) => {
		await app.borrow.open();
		await app.borrow.productHub.header.position.shouldBe('Borrow');
		await app.borrow.productHub.list.allPoolsShouldBe('Borrow');
	});

	test('It should link to pool finder - Borrow', async ({ app }) => {
		await app.borrow.open();
		await app.borrow.productHub.list.openPoolFinder();

		await app.poolFinder.shouldHaveHeader('Borrow');
	});
});
