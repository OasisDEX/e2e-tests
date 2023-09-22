import { test } from '#noWalletFixtures';

test.describe('Earn page', async () => {
	test('It should list only Earn positions', async ({ app }) => {
		await app.earn.open();
		await app.earn.productHub.header.position.shouldBe('Earn');
		await app.earn.productHub.list.allPoolsShouldBe('Earn');
	});

	// !!! Test skipped until Ajna products are enabled back
	test.skip('It should open Earn pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11556',
		});

		await app.earn.open();
		await app.earn.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});
});