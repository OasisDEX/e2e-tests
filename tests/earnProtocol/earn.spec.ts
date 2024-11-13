import { test } from '#earnProtocolFixtures';

test.describe.only(`Earn page`, async () => {
	test.beforeEach(async ({ app }) => {
		await app.earn.openPage();
	});

	(['BASE', 'ARBITRUM_ONE'] as const).forEach((network) => {
		test(`It should select ${network} network`, async ({ app }) => {
			await app.earn.networkSelector.open();

			await app.earn.networkSelector.select({ option: network });

			await app.earn.networkSelector.shouldBe({ option: network });
		});
	});
});
