import { test } from '#fixtures';

test.describe('Borrow', async () => {
	test('It should list only Borrow positions', async ({ app }) => {
		await app.borrow.open();
		await app.borrow.productHub.header.position.shouldBe('Borrow');
		await app.borrow.productHub.list.allPoolsShouldBe('Borrow');
	});

	test('It should open Borrow pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11557',
		});

		await app.borrow.open();
		await app.borrow.productHub.list.openPoolFinder();

		await app.poolFinder.shouldHaveHeader('Borrow');
	});
});
