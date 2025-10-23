import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Overview page - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
	});

	test('I should display User role', async ({ app }) => {
		await app.clientDashboard.shouldHaveRoles({ user: 'Viewer', wallet: 'No wallet connected' });
	});

	test('It should display "Total value", "Vaults #", "30d APY" and "Performance', async ({
		app,
	}) => {
		await app.clientDashboard.shouldHaveSummary({
			totalValue: '[1-9].[0-9]{2}',
			numberOfVaults: '1',
			thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
			allTimePerformance: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should have "Overview" tab active by default', async ({ app }) => {
		await app.clientDashboard.shoulHaveTabActive('Overview');
	});

	test('It should switch to all available tabs', async ({ app }) => {
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.shoulHaveTabActive('Vaults');
		await app.clientDashboard.vaults.shouldBeVisible();

		await app.clientDashboard.selectTab('Overview');
		await app.clientDashboard.shoulHaveTabActive('Overview');
		await app.clientDashboard.overview.shouldBeVisible();

		await app.clientDashboard.selectTab('Risk');
		await app.clientDashboard.shoulHaveTabActive('Risk');
		// TO BE DONE - Risk panel not implemented yet
		// await app.clientDashboard.risk.shouldBeVisible();

		await app.clientDashboard.selectTab('Fees & Revenue');
		await app.clientDashboard.shoulHaveTabActive('Fees & Revenue');
		// TO BE DONE - Fees & Revenue panel not implemented yet
		// await app.clientDashboard.feesAndRevenue.shouldBeVisible();

		await app.clientDashboard.selectTab('Reports');
		await app.clientDashboard.shoulHaveTabActive('Reports');
		// TO BE DONE - Reports panel not implemented yet
		// await app.clientDashboard.reports.shouldBeVisible();

		await app.clientDashboard.selectTab('News');
		await app.clientDashboard.shoulHaveTabActive('News');
		// TO BE DONE - News panel not implemented yet
		// await app.clientDashboard.news.shouldBeVisible();
	});
});
