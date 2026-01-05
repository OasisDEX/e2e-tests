import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Client dashboard - Overview - Institution overview', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
	});

	test('It should list vaults', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.shouldHaveVaults([
			{
				name: 'ExtDemoCorp USDC base',
				value: '[0-9]{1,3}.[0-9]{2}',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{1,2}',
				nav: '[0-9]{1,2}.[0-9]{2,4}',
			},
			{
				name: 'ExtDemoCorp USDC arbitrum',
				value: '[0-9]{1,3}.[0-9]{1,2}',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{1,2}',
				nav: '[0-9]{1,2}.[0-9]{2,4}',
			},
		]);
	});

	test('It should view a vault', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.viewVault('ExtDemoCorp USDC base');
		await app.clientDashboard.vaults.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			name: 'ExtDemoCorp USDC base',
			// asset: 'USDC', --> Field removed from UI
			liveApy: '[0-9]{1,2}.[0-9]{2}',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9]{1,3}.[0-9]{1,4}',
			fee: '[0-9].[0-9]{2}',
			inception: 'December 17, 2025',
		});
	});
});
