import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Vaults - Overview', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.selectTab('Vaults');
		await app.clientDashboard.vaults.overview.shouldBeVisible();
	});

	test(`It should show Vaults' overview data`, async ({ app }) => {
		// Switch to Arbitrum vault
		await app.clientDashboard.vaults.openVaultsDropdown();
		await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC arbitrum');

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			name: 'ExtDemoCorp USDC arbitrum',
			liveApy: '[0-9]{1,2}.[0-9]{2}',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9]{1,3}.[0-9]{1,4}',
			fee: '[0-9].[0-9]{2}',
			inception: 'December 17, 2025',
		});

		// Switch to Base vault
		await app.clientDashboard.vaults.openVaultsDropdown();
		await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC base');

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			name: 'ExtDemoCorp USDC base',
			liveApy: '[0-9]{1,2}.[0-9]{2}',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9]{1,3}.[0-9]{1,4}',
			fee: '[0-9].[0-9]{2}',
			inception: 'December 17, 2025',
		});
	});

	test(`It should show Vaults' charts`, async ({ app }) => {
		// Assert Base vault
		await app.clientDashboard.vaults.overview.shouldHavePerformanceChart();
		await app.clientDashboard.vaults.overview.shouldHaveApyChart();
		await app.clientDashboard.vaults.overview.shouldHaveAumChart();

		// Switch to Arbitrum vault
		await app.clientDashboard.vaults.openVaultsDropdown();
		await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC arbitrum');

		await app.clientDashboard.vaults.overview.shouldHavePerformanceChart();
		await app.clientDashboard.vaults.overview.shouldHaveApyChart();
		await app.clientDashboard.vaults.overview.shouldHaveAumChart();
	});

	test(`It should show Vaults' contract addresses`, async ({ app }) => {
		// Assert Base vault
		await app.clientDashboard.vaults.overview.shouldHaveContractAddresses({
			fleet: '0x1db644c6077912cf5dab0b5a7f2d8efb5b61df5c',
			admiralsQuarters: '0x477285d524628faa3ed62d8086be56810a34795e',
			harborCommand: '0xa65ba2593d7be9c64c000c93e3cb99c79c1a6241',
		});

		// Switch to Arbitrum vault
		await app.clientDashboard.vaults.openVaultsDropdown();
		await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC arbitrum');

		await app.clientDashboard.vaults.overview.shouldHaveContractAddresses({
			fleet: '0x2d55c68e6b9b6b3f70be2e51f289751e627f50ad',
			admiralsQuarters: '0xe0fd6d8a7c8a3171b4e4c2d3b53ae6aa3f8970ae',
			harborCommand: '0xc78f28a971d466e58e39b2de5da15ec2c4449367',
		});
	});
});
