import { expect, test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Vaults - Vault exposure', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.vaults.selectPanel('Vault exposure');
	});

	// TO DO
	//  - For diferent vaults --> ([vault1, vault2]).forEach(test())

	test('It should show asset allocation - Default view', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		// await app.clientDashboard.vaults.openVaultsDropdown();

		await app.clientDashboard.vaults.vaultExposure.shouldHaveAssetAllocationBar();
		await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel();
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		// await app.clientDashboard.vaults.openVaultsDropdown();

		// Wait for Exposure panel to load
		await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel();

		const totalAllocation =
			await app.clientDashboard.vaults.vaultExposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeGreaterThan(99);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});

	test('It should not have duplicated strategy names', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		// await app.clientDashboard.vaults.openVaultsDropdown();

		// Wait for Exposure panel to load
		await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel();

		await app.clientDashboard.vaults.vaultExposure.shouldNotHaveDuplicatedStrategyNames();
	});

	test('It should not have 0.00% APY for any arks', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		// await app.clientDashboard.vaults.openVaultsDropdown();

		// Wait for Exposure panel to load
		await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel();

		await app.clientDashboard.vaults.vaultExposure.shouldNotHaveStrategyApysEqualToZero();
	});
});
