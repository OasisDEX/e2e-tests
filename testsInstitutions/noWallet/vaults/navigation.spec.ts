import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Vaults - Navigation', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
	});

	test('It should switch to all available panels', async ({ app }) => {
		// 'Overview' panel selected by default
		await app.clientDashboard.vaults.shouldHavePanelActive('Overview');

		// Select 'Vault exposure' tab
		await app.clientDashboard.vaults.selectPanel('Vault exposure');
		await app.clientDashboard.vaults.shouldHavePanelActive('Vault exposure');
		await app.clientDashboard.vaults.vaultExposure.shouldBeVisible();

		// Select 'Asset relocation' tab
		await app.clientDashboard.vaults.selectPanel('Asset relocation');
		await app.clientDashboard.vaults.shouldHavePanelActive('Asset relocation');
		await app.clientDashboard.vaults.assetRelocation.shouldBeVisible();

		// Select 'Risk Parameters' tab
		await app.clientDashboard.vaults.selectPanel('Risk Parameters');
		await app.clientDashboard.vaults.shouldHavePanelActive('Risk Parameters');
		await app.clientDashboard.vaults.riskParameters.shouldBeVisible();

		// Select 'Role admin' tab
		await app.clientDashboard.vaults.selectPanel('Role admin');
		await app.clientDashboard.vaults.shouldHavePanelActive('Role admin');
		await app.clientDashboard.vaults.roleAdmin.shouldBeVisible();

		// Select 'Client admin' tab
		await app.clientDashboard.vaults.selectPanel('Client admin');
		await app.clientDashboard.vaults.shouldHavePanelActive('Client admin');
		await app.clientDashboard.vaults.clientAdmin.shouldBeVisible();

		// Select 'Fee & revenue admin' tab
		await app.clientDashboard.vaults.selectPanel('Fee & revenue admin');
		await app.clientDashboard.vaults.shouldHavePanelActive('Fee & revenue admin');
		await app.clientDashboard.vaults.feeAndRevenueAdmin.shouldBeVisible();

		// Select 'Activity' tab
		await app.clientDashboard.vaults.selectPanel('Activity');
		await app.clientDashboard.vaults.shouldHavePanelActive('Activity');
		await app.clientDashboard.vaults.activity.shouldBeVisible();

		// Select 'Overview' tab
		await app.clientDashboard.vaults.selectPanel('Overview');
		await app.clientDashboard.vaults.shouldHavePanelActive('Overview');
		await app.clientDashboard.vaults.overview.shouldBeVisible();
	});
});
