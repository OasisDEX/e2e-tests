import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Vaults - Vault exposure', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.vaults.selectPanel('Vault exposure');
	});

	// TO DO
	//  - For diferent vaults --> ([vault1, vault2]).forEach(test())

	test('It should show asset allocation - Defaylt view', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		// await app.clientDashboard.vaults.openVaultsDropdown();

		await app.clientDashboard.vaults.vaultExposure.shouldHaveAssetAllocationBar();

		// TO DO - Assert strategies table
	});
});
