import { test } from '#earnProtocolFixtures';

test.describe(`Earn page`, async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		// Wait to avoid random fails
		await app.header.shouldHaveSummerfiLogo();
		await app.page.waitForTimeout(2_000);
	});

	(['BASE', 'ARBITRUM', 'MAINNET'] as const).forEach((network) => {
		const networkShortName: { [index: string]: 'base' | 'arbitrum' | 'ethereum' } = {
			BASE: 'base',
			ARBITRUM: 'arbitrum',
			MAINNET: 'ethereum',
		};
		test(`It should select ${network} network`, async ({ app }) => {
			await app.earn.networkSelector.open();

			await app.earn.networkSelector.select({ option: network });

			await app.earn.networkSelector.shouldBe({ option: network });
			await app.earn.vaults.allVaultsShouldBe(networkShortName[network]);
		});
	});
});
