import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Overview - Institution overview', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
	});

	test('It should list vaults', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.shouldHaveVaults([
			{ name: 'Summer USDC Base Vault', value: '[0-9]{1,2}.[0-9]{1,2}', thirtyDayAPY: '-' },
		]);
	});

	test('It should view a vault', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.viewVault('Summer USDC Base Vault');

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			// name: 'Summer USDC Base Vault', --> BUG
			asset: 'USDC',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9].[0-9]{1,4}',
			fee: '[0-9].[0-9]{1,2}',
			inception: 'July 24, 2025',
		});
	});
});
