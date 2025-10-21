import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Overview - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
	});

	test('It should switch to all available panels', async ({ app }) => {
		// 'Institution overview' panel selected by default
		await app.clientDashboard.overview.shouldHavePanelActive('Institution overview');

		// Select 'Manage internal users' tab
		await app.clientDashboard.overview.selectPanel('Manage internal users');
		await app.clientDashboard.overview.shouldHavePanelActive('Manage internal users');
		// TO DO
		// await app.clientDashboard.overview.manageInternalUsers.shouldBeVisible();

		// Select 'Institution overview' tab
		await app.clientDashboard.overview.selectPanel('Institution overview');
		await app.clientDashboard.overview.shouldHavePanelActive('Institution overview');
		// TO DO
		// await app.clientDashboard.overview.institutionOverview.shouldBeVisible();
	});
});
