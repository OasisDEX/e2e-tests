import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

// TO DO
test.describe.skip('Client dashboard - Fees & Revenue - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Fees & Revenue');
	});

	test('It should switch to all available panels', async ({ app }) => {
		// TO DO --> Panel not implemented yet
		// // 'Overview' panel selected by default
		// await app.clientDashboard.feesAndRevenue.shouldHavePanelActive('Overview');
		// // Select 'Vault exposure' tab
		// await app.clientDashboard.feesAndRevenue.selectPanel('Vault exposure');
		// await app.clientDashboard.feesAndRevenue.shouldHavePanelActive('Vault exposure');
		// await app.clientDashboard.feesAndRevenue.vaultExposure.shouldBeVisible();
		// // Select 'Overview' tab
		// await app.clientDashboard.feesAndRevenue.selectPanel('Overview');
		// await app.clientDashboard.feesAndRevenue.shouldHavePanelActive('Overview');
		// await app.clientDashboard.feesAndRevenue.overview.shouldBeVisible();
	});
});
