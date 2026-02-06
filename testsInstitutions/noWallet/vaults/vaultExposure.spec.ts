import { expect, test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';
import { expectDefaultTimeout } from 'utils/config';

['USDC Base', 'USDC arbitrum'].forEach((vault) =>
	test.describe('Client dashboard - Vaults - Vault exposure', async () => {
		test.beforeEach(async ({ app }) => {
			await signIn({ app, userRights: 'client', role: 'Viewer' });
			await app.clientDashboard.selectTab('Vaults');

			if (vault === 'USDC arbitrum') {
				// Switch to Arbitrum USDC vault
				await app.clientDashboard.vaults.openVaultsDropdown();
				await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC arbitrum');
				await app.clientDashboard.vaults.shouldHaveVaultHeader({
					name: 'ExtDemoCorp USDC arbitrum',
				});
			}

			await app.clientDashboard.vaults.selectPanel('Vault exposure');
			// Wait for Exposure panel to load
			await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel({
				timeout: expectDefaultTimeout * 3,
			});
		});

		test(`It should show asset allocation - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.shouldHaveAssetAllocationBar();
		});

		test(`It should show strategies exposure and be 100% in total - ${vault}`, async ({ app }) => {
			const totalAllocationBase =
				await app.clientDashboard.vaults.vaultExposure.getStrategiesTotalAllocation();

			expect(totalAllocationBase).toBeGreaterThan(99);
			expect(totalAllocationBase).toBeLessThanOrEqual(100);
		});

		test(`It should not have duplicated strategy names - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.shouldNotHaveDuplicatedStrategyNames();
		});

		test(`It should not have 0.00% APY for any arks - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.shouldNotHaveStrategyApysEqualToZero();
		});

		test(`It should have arks available on chain- ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.shouldHaveArksOnChain([
				{
					name: 'Morpho USDC Gauntlet Core',
					apy: '[0-9]{1,2}.[0-9]{1,2}',
					protocolTvl: '[0-9]{1,3}.[0-9]{1,2}[BM]',
				},
			]);
		});
	}),
);
