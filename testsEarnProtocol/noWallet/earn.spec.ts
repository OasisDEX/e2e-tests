import { test } from '#earnProtocolFixtures';

test.describe('Earn page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);
	});

	(['ARBITRUM', 'BASE', 'MAINNET', 'SONIC', 'HYPERLIQUID'] as const).forEach((network) => {
		const networkShortName: {
			[index: string]: 'arbitrum' | 'base' | 'ethereum' | 'sonic' | 'hyperliquid';
		} = {
			ARBITRUM: 'arbitrum',
			BASE: 'base',
			MAINNET: 'ethereum',
			SONIC: 'sonic',
			HYPERLIQUID: 'hyperliquid',
		};
		test(`It should select ${network} network`, async ({ app }) => {
			await app.earn.networkSelector.open();

			await app.earn.networkSelector.select({ option: network });

			await app.earn.networkSelector.shouldBe({ option: network });
			await app.earn.vaults.allVaultsShouldBe(networkShortName[network]);
		});
	});
});
