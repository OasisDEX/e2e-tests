import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

// TO DO
test.describe.skip('Client dashboard - News - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('News');
	});

	test('It should switch to all available panels', async ({ app }) => {
		// TO DO --> Panel not implemented yet
		// // 'Overview' panel selected by default
		// await app.clientDashboard.news.shouldHavePanelActive('Overview');
		// // Select 'Vault exposure' tab
		// await app.clientDashboard.news.selectPanel('Vault exposure');
		// await app.clientDashboard.news.shouldHavePanelActive('Vault exposure');
		// await app.clientDashboard.news.vaultExposure.shouldBeVisible();
		// // Select 'Overview' tab
		// await app.clientDashboard.news.selectPanel('Overview');
		// await app.clientDashboard.news.shouldHavePanelActive('Overview');
		// await app.clientDashboard.news.overview.shouldBeVisible();
	});
});
