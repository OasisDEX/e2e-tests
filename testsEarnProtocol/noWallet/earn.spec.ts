import { test } from '#earnProtocolFixtures';

test.describe('Earn page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);
	});

	test.only('It should filter by Risk Management type', async ({ app }) => {
		await app.earn.filterByRiskManagementType('DAO Risk-Managed New!');
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'riskManagementTypes',
			riskManagementType: 'DAO Risk-Managed',
		});

		await app.earn.filterByRiskManagementType('Risk-Managed By BlockAnalitica');
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'riskManagementTypes',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
		});
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
			await app.earn.vaults.allVaultsShouldBe({
				filter: 'networks',
				network: networkShortName[network],
			});
		});
	});

	(['All stables', 'ETH', 'EURC', 'USDC', 'USDC.E', 'USDT', 'All assets'] as const).forEach(
		(asset) => {
			test(`It should filter by assets -  "${asset}"`, async ({ app }) => {
				await app.earn.assetsSelector.open();

				await app.earn.assetsSelector.select({ option: asset });

				await app.earn.assetsSelector.shouldBe({ option: asset });
				await app.earn.vaults.allVaultsShouldBe({ filter: 'assets', asset });
			});
		},
	);
});
