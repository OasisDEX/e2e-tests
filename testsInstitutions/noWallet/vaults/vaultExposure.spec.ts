import { expect, test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';
import { expectDefaultTimeout } from 'utils/config';

['USDC Base', 'USDC arbitrum'].forEach((vault) =>
	test.describe('Client dashboard - Vaults - Vault exposure', async () => {
		test.beforeEach(async ({ app }) => {
			await signIn({ app, userRights: 'client', role: 'Viewer' });
			await app.clientDashboard.selectTab('Vaults');

			if (vault === 'USDC arbitrum') {
				// Switch to Arbitrum USDC vault
				await app.clientDashboard.vaults.openVaultsDropdown();
				await app.clientDashboard.vaults.selectVault('ExtDemoCorp USDC arbitrum');
				await app.clientDashboard.vaults.shouldHaveVaultHeader({
					name: 'ExtDemoCorp USDC arbitrum',
				});
			}

			await app.clientDashboard.vaults.selectPanel('Vault exposure');
			// Wait for Exposure panel to load
			await app.clientDashboard.vaults.vaultExposure.shouldHaveVaultExposurePanel({
				timeout: expectDefaultTimeout * 3,
			});
		});

		test(`It should show asset allocation - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.shouldHaveAssetAllocationBar();
		});

		test(`It should show tooltip in Asset Allocation bar - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.openTooltipInAssetAllocationBar(1);
			if (vault === 'USDC Base') {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Morpho USDC Gauntlet Prime.*[0-9]{2}.[0-9]{2}%',
				);
			} else {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Morpho USDC Gauntlet Core.*[0-9]{2}.[0-9]{2}%',
				);
			}

			await app.clientDashboard.vaults.vaultExposure.openTooltipInAssetAllocationBar(2);
			if (vault === 'USDC Base') {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Morpho USDC Moonwell Flagship.*[0-9]{2}.[0-9]{2}%',
				);
			} else {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Morpho USDC Gauntlet Prime.*[0-9]{2}.[0-9]{2}%',
				);
			}

			await app.clientDashboard.vaults.vaultExposure.openTooltipInAssetAllocationBar(3);
			if (vault === 'USDC Base') {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip('Buffer.*[0-9].[0-9]{2}%');
			} else {
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Other Protocols:.*Buffer.*[0-9].[0-9]{2}%',
				);
			}

			if (vault === 'USDC Base') {
				await app.clientDashboard.vaults.vaultExposure.openTooltipInAssetAllocationBar(4);
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Other Protocols:.*FluidFToken USDC.*[0-9].[0-9]{2}%',
				);
			}
		});

		test(`It should show strategies exposure and be 100% in total - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.viewMoreStrategies();

			const totalAllocationBase =
				await app.clientDashboard.vaults.vaultExposure.getStrategiesTotalAllocation();

			expect(totalAllocationBase).toBeGreaterThan(99);
			expect(totalAllocationBase).toBeLessThanOrEqual(100);
		});

		test(`It should not have duplicated strategy names - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.viewMoreStrategies();

			await app.clientDashboard.vaults.vaultExposure.shouldNotHaveDuplicatedStrategyNames();
		});

		test(`It should not have 0.00% APY for any arks - ${vault}`, async ({ app }) => {
			await app.clientDashboard.vaults.vaultExposure.viewMoreStrategies();

			await app.clientDashboard.vaults.vaultExposure.shouldNotHaveStrategyLiveApysEqualToZero();
		});

		test(`It should switch to All | Allocated | Unallocated strategy tabs - ${vault}`, async ({
			app,
		}) => {
			// 'All' tab selected by default
			await app.clientDashboard.vaults.vaultExposure.viewMoreStrategies();
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesWithAndWithoutAllocation();

			// Switch to 'Allocated' tab
			await app.clientDashboard.vaults.vaultExposure.selectStrategiesAllocationTab('Allocated');

			await app.clientDashboard.vaults.vaultExposure.shouldHaveAllStrategiesWithAllocation();

			// Switch to 'Unallocated' tab
			await app.clientDashboard.vaults.vaultExposure.selectStrategiesAllocationTab('Unallocated');

			await app.clientDashboard.vaults.vaultExposure.shouldHaveAllStrategiesWithoutAllocation();

			// Switch to 'All' tab
			await app.clientDashboard.vaults.vaultExposure.selectStrategiesAllocationTab('All');

			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesWithAndWithoutAllocation();
		});

		test(`It should show tooltips in Vault Exposure panel - ${vault}`, async ({ app }) => {
			// Live APY tooltip
			await app.clientDashboard.vaults.vaultExposure.openLiveApyTooltipInVaultExposurePanel();
			await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
				'Lazy.*Summer.*Live.*APY:.*[0-9]{1,2}.[0-9]{2}%',
			);

			if (vault === 'USDC Base') {
				// Allocation Cap tooltip - Morpho Gauntlet Prime
				await app.clientDashboard.vaults.vaultExposure.openAllocationCapTooltipInVaultExposurePanel(
					{ strategy: 'Morpho USDC Gauntlet Prime' },
				);
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Allocation cap.*[0-9]{3}.[0-9]{2}.*USDC' +
						'.*' +
						'Absolute allocation cap.*[0-9]{3}.[0-9]{2}.*USDC' +
						'.*' +
						'TVL allocation cap %.*[0-9]{2}.[0-9]{2}%.*\\([0-9]{3}.[0-9]{2}\\)' +
						'.*' +
						'Cap utilisation.*[0-9]{2,3}%.*\\([0-9]{3}.[0-9]{2}.*\\/.*[0-9]{3}.[0-9]{2}\\)',
				);
			}

			if (vault === 'USDC arbitrum') {
				// Allocation Cap tooltip - Morpho Gauntlet Core
				await app.clientDashboard.vaults.vaultExposure.openAllocationCapTooltipInVaultExposurePanel(
					{ strategy: 'Morpho USDC Gauntlet Core' },
				);
				await app.clientDashboard.vaults.vaultExposure.shouldHaveTooltip(
					'Allocation cap.*[0-9]{3}.[0-9]{2}.*USDC' +
						'.*' +
						'Absolute allocation cap.*[0-9]{3}.[0-9]{2}.*USDC' +
						'.*' +
						'TVL allocation cap %.*[0-9]{2}.[0-9]{2}%.*\\([0-9]{3}.[0-9]{2}\\)' +
						'.*' +
						'Cap utilisation.*[0-9]{2,3}%.*\\([0-9]{3}.[0-9]{2}.*\\/.*[0-9]{3}.[0-9]{2}\\)',
				);
			}
		});

		test(`It should sort strategies in Vault Exposure panel - ${vault}`, async ({ app }) => {
			// By Live APY
			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Live APY');
			await app.clientDashboard.vaults.vaultExposure.viewMoreStrategies();
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Live APY',
				sorting: 'Highest first',
			});

			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Live APY');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Live APY',
				sorting: 'Lowest first',
			});

			// By 30d AVG. APY
			await app.clientDashboard.vaults.vaultExposure.sortTableBy('30d AVG. APY');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: '30d AVG. APY',
				sorting: 'Highest first',
			});

			await app.clientDashboard.vaults.vaultExposure.sortTableBy('30d AVG. APY');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: '30d AVG. APY',
				sorting: 'Lowest first',
			});

			// By Allocated
			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Allocated');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Allocated',
				sorting: 'Highest first',
			});

			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Allocated');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Allocated',
				sorting: 'Lowest first',
			});

			// By Allocation Cap
			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Allocation Cap');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Allocation Cap',
				sorting: 'Highest first',
			});

			await app.clientDashboard.vaults.vaultExposure.sortTableBy('Allocation Cap');
			await app.page.waitForTimeout(500);
			await app.clientDashboard.vaults.vaultExposure.shouldHaveStrategiesSortedBy({
				column: 'Allocation Cap',
				sorting: 'Lowest first',
			});
		});

		test(`It should have arks available on chain - ${vault}`, async ({ app }) => {
			if (vault === 'USDC Base') {
				// USDC Base arks
				await app.clientDashboard.vaults.vaultExposure.shouldHaveArksOnChain([
					{
						name: 'Morpho USDC Gauntlet Prime',
						apy: '[0-9]{1,2}.[0-9]{1,2}',
						protocolTvl: '[0-9]{1,3}.[0-9]{1,2}[BM]',
						description:
							'A high-efficiency USDC strategy, leveraging tested methodologies to maximize yield while minimizing inefficiencies',
					},

					{
						name: 'Aave V3 USDC',
						apy: '[0-9]{1,2}.[0-9]{1,2}',
						protocolTvl: '[0-9]{1,3}.[0-9]{1,2}[BM]',
						description:
							'A proven USDC strategy, engineered for consistent performance and structured to reduce exposure to inefficiencies',
					},
				]);
			} else {
				// USDC Arbitrum arks
				await app.clientDashboard.vaults.vaultExposure.shouldHaveArksOnChain([
					{
						name: 'Morpho USDC Gauntlet Core',
						apy: '[0-9]{1,2}.[0-9]{1,2}',
						protocolTvl: '[0-9]{1,3}.[0-9]{1,2}[BM]',
						description: 'No description available',
					},
					{
						name: 'FluidFToken USDC',
						apy: '[0-9]{1,2}.[0-9]{1,2}',
						protocolTvl: '[0-9]{1,3}.[0-9]{1,2}[BM]',
						description: 'No description available',
					},
				]);
			}
		});
	}),
);
