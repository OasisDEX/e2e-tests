import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Overview page - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
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
		// TO BE DONE
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.shoulHaveTabActive('Vaults');
		await app.clientDashboard.vaults.shouldBeVisible();
	});
});
