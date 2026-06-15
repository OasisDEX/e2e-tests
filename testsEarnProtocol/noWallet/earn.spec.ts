import { test } from '#earnProtocolFixtures';

test.describe('Earn page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);
	});

	test('It should filter by Vault type', async ({ app }) => {
		await app.earn.filterByVaultType('DeFi Vaults');
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'vaultTypes',
			vaultType: 'DeFi Vaults',
		});

		await app.earn.filterByVaultType('Permissioned RWA Vaults');
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'vaultTypes',
			vaultType: 'Permissioned RWA Vaults',
		});
	});

	// 'ARBITRUM', 'HYPERLIQUID' and 'SONIC' disabled (cap=0.00)
	(['BASE', 'MAINNET'] as const).forEach((network) => {
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
			await app.earn.vaults.allVaultsShouldBe({
				filter: 'networks',
				network: networkShortName[network],
			});
		});
	});

	// USDC.E (Sonic) disabled (cap=0.00)
	(['All stables', 'ETH', 'EURC', 'USDC', 'USDT', 'All assets'] as const).forEach((asset) => {
		test(`It should filter by assets -  "${asset}"`, async ({ app }) => {
			await app.earn.assetsSelector.open();

			await app.earn.assetsSelector.select({ option: asset });
			await app.earn.assetsSelector.shouldBe({ option: asset });

			await app.earn.vaults.allVaultsShouldBe({ filter: 'assets', asset });
		});
	});
});
