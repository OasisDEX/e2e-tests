import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

// TO DO
//  - Asserting real content (placeholder right now)
//  - For diferent vaults
test.describe.skip('Client dashboard - Vaults - Overview', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
	});

	test('It should show Performance and AUM', async ({ app }) => {
		// TO DO - Select vault from vaults' dropdown
		await app.clientDashboard.vaults.openVaultsDropdown();

		// TO DO - Assert content in Overview panel
	});
});
