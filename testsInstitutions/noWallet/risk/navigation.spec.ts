import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

// TO DO
test.describe.skip('Client dashboard - Risk - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Risk');
	});

	test('It should switch to all available panels', async ({ app }) => {
		// TO DO --> Panel not implemented yet
		// // 'Overview' panel selected by default
		// await app.clientDashboard.risk.shouldHavePanelActive('Overview');
		// // Select 'Vault exposure' tab
		// await app.clientDashboard.risk.selectPanel('Vault exposure');
		// await app.clientDashboard.risk.shouldHavePanelActive('Vault exposure');
		// await app.clientDashboard.risk.vaultExposure.shouldBeVisible();
		// // Select 'Overview' tab
		// await app.clientDashboard.risk.selectPanel('Overview');
		// await app.clientDashboard.risk.shouldHavePanelActive('Overview');
		// await app.clientDashboard.risk.overview.shouldBeVisible();
	});
});
