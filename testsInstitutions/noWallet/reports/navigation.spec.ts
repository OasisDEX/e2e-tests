import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

// TO DO
test.describe.skip('Client dashboard - Reports - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Reports');
	});

	test('It should switch to all available panels', async ({ app }) => {
		// TO DO --> Panel not implemented yet
		// // 'Overview' panel selected by default
		// await app.clientDashboard.reports.shouldHavePanelActive('Overview');
		// // Select 'Vault exposure' tab
		// await app.clientDashboard.reports.selectPanel('Vault exposure');
		// await app.clientDashboard.reports.shouldHavePanelActive('Vault exposure');
		// await app.clientDashboard.reports.vaultExposure.shouldBeVisible();
		// // Select 'Overview' tab
		// await app.clientDashboard.reports.selectPanel('Overview');
		// await app.clientDashboard.reports.shouldHavePanelActive('Overview');
		// await app.clientDashboard.reports.overview.shouldBeVisible();
	});
});
