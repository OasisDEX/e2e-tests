import { test } from '#fixtures';

test.describe('Earn page', async () => {
	test('It should list only Earn positions', async ({ app }) => {
		await app.earn.open();
		await app.earn.productHub.header.position.shouldBe('Earn');
		await app.earn.productHub.list.allPoolsShouldBe('Earn');
	});

	test('It should link to pool finder - Earn', async ({ app }) => {
		await app.earn.open();
		await app.earn.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});
});
