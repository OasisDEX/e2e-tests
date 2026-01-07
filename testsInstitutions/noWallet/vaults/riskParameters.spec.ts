import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Vaults - Risk Parameters', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.vaults.selectPanel('Risk Parameters');
		await app.clientDashboard.vaults.riskParameters.shouldBeVisible();
	});

	test('It should Vault and Market risk parameters', async ({ app }) => {
		await app.clientDashboard.vaults.riskParameters.shouldHaveVaultRiskParameters({
			vaultCap: '([0-9]{1,3},)?[0-9]{1,3}.[0-9]{2}.*USDC',
			buffer: '[0-9]{1,3}.[0-9]{2}.*USDC',
		});

		await app.clientDashboard.vaults.riskParameters.shouldHaveMarketRiskParameters([
			{
				marketName: 'FluidFToken',
				marketCap: '[0-9]{1,3}.[0-9]{2}.*USDC',
				maxPercentage: '[0-9]{1,2}.[0-9]{2}%',
				impliedCap: '[0-9]{1,3}.*USDC',
			},
			{
				marketName: 'CompoundV3',
				marketCap: '250.00.*USDC',
				maxPercentage: '45.00%',
				impliedCap: '250.*USDC',
			},
		]);
	});
});
