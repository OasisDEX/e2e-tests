import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Client dashboard - Overview - Institution overview', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
	});

	test('It should display Value Locked graph and switch off/on "Stack" feature', async ({
		app,
	}) => {
		await app.clientDashboard.overview.institutionOverview.shouldHaveValueLockedChart();
		// Stacked feature should be ON by default
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedFeature('On');
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedChartMaxY('$2000.00');

		// Switch Stacked OFF
		await app.clientDashboard.overview.institutionOverview.switchStacked();
		// Stacked feature should be OFF
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedChartMaxY('$1000.00');
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedFeature('Off');

		// Switch Stacked ON
		await app.clientDashboard.overview.institutionOverview.switchStacked();
		// Stacked feature should be ON
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedChartMaxY('$2000.00');
		await app.clientDashboard.overview.institutionOverview.shouldHaveStackedFeature('On');
	});

	test('It should have tooltip with date and TVL per vault', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.shouldHaveValueLockedChart();
		await app.clientDashboard.overview.institutionOverview.openChartTooltip();
		await app.clientDashboard.overview.institutionOverview.shouldHaveChartTooltipWithDateAndArksTvl();
	});

	test('It should show data for different time periods', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.shouldHaveValueLockedChart();

		// 90d by default
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('90d');

		// Switch to '7d' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('7d');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('7d');

		// Switch to '30d' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('30d');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('30d');

		// Switch to '90d' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('90d');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('90d');

		// Switch to '6m' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('6m');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('6m');

		// Switch to '1y' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('1y');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('1y');

		// Switch to '3y' view
		await app.clientDashboard.overview.institutionOverview.selectTimePeriod('3y');
		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.institutionOverview.shouldHaveTimePeriodInX('3y');
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

	test('It should view "ExtDemoCorp USDC base" vault', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.viewVault('ExtDemoCorp USDC base');
		await app.clientDashboard.vaults.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			name: 'ExtDemoCorp USDC base',
			liveApy: '[0-9]{1,2}.[0-9]{2}',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9]{1,3}.[0-9]{1,4}',
			fee: '[0-9].[0-9]{2}',
			inception: 'December 17, 2025',
		});
	});

	test('It should view "ExtDemoCorp USDC arbitrum" vault', async ({ app }) => {
		await app.clientDashboard.overview.institutionOverview.viewVault('ExtDemoCorp USDC arbitrum');
		await app.clientDashboard.vaults.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });

		await app.clientDashboard.vaults.shouldHaveVaultHeader({
			name: 'ExtDemoCorp USDC arbitrum',
			liveApy: '[0-9]{1,2}.[0-9]{2}',
			nav: '[0-9].[0-9]{1,4}',
			aum: '[0-9]{1,3}.[0-9]{1,4}',
			fee: '[0-9].[0-9]{2}',
			inception: 'December 17, 2025',
		});
	});
});
