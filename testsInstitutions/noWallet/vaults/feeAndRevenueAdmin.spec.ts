import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Vaults - Fee & revenue admin', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.vaults.selectPanel('Fee & revenue admin');
		await app.clientDashboard.vaults.feeAndRevenueAdmin.shouldBeVisible();
	});

	test('It should have AUM fee and No third party costs', async ({ app }) => {
		await app.clientDashboard.vaults.feeAndRevenueAdmin.shouldHaveFeeRevenue({
			vaultAumFee: '1.00',
		});
		await app.clientDashboard.vaults.feeAndRevenueAdmin.shouldHaveNoThirdPArtyCosts();
	});
});
