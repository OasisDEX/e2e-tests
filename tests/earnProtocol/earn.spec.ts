import { test } from '#earnProtocolFixtures';

test.describe(`Earn page`, async () => {
	test('It should select network', async ({ app }) => {
		await app.earn.openPage();

		await app.earn.networkSelector.open();

		await app.earn.networkSelector.select({ option: 'base' });

		await app.earn.networkSelector.shouldBe({ option: 'base' });
	});
});
