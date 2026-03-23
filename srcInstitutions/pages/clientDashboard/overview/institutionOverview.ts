import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';

type TimePeriods = '7d' | '30d' | '90d' | '6m' | '1y' | '3y';

export class InstitutionOverview {
	readonly page: Page;

	readonly panelLocator: Locator;

	readonly stackedSliderLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.panelLocator = page.locator('[class*="PanelInstitutionOverview"]');
		this.stackedSliderLocator = page
			.getByText('Stacked', { exact: true })
			.locator('..')
			.locator('[class*="_slider_"]');
	}

	vaultLocator(name: string): Locator {
		return this.page.locator(`[class*="_yourVaultsWrapper_"] tbody tr:has-text("${name}")`);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.panelLocator.getByText('Your Vaults', { exact: true }),
			'"Your Vaults" section should be visible',
		).toBeVisible();
	}

	@step
	async shouldHaveValueLockedChart() {
		await expect(
			this.panelLocator.getByText('Total Value Locked'),
			'Should display "Total Value Locked" chart title',
		).toBeVisible();

		await expect(
			this.panelLocator.locator('[class*="_tvlChart_"]'),
			'Should display TVL chart',
		).toBeVisible();
	}

	@step
	async openChartTooltip() {
		await this.page.locator('[class="recharts-wrapper"] [class="recharts-layer"]').first().hover();
		await expect(
			this.page.locator('[class="recharts-default-tooltip"]'),
			'TVL chart tooltip should be visible',
		).toBeVisible();
	}

	@step
	async shouldHaveChartTooltipWithDateAndArksTvl() {
		const dateRegExp = '[0-3][0-9].*[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec].*202[5-9]';
		const arbVault = 'ExtDemoCorp USDC arbitrum.*:.*[0-9]{4}.[0-9]{2}';
		const baseVault = 'ExtDemoCorp USDC base.*:.*[0-9]{4}.[0-9]{2}';

		const regExp = new RegExp(`${dateRegExp}.*${arbVault}.*${baseVault}`);

		await expect(this.page.locator('[class="recharts-default-tooltip"]')).toContainText(regExp);
	}

	@step
	async switchStacked() {
		await this.stackedSliderLocator.click();
	}

	@step
	async shouldHaveStackedFeature(status: 'On' | 'Off') {
		const backgroundColor = await this.stackedSliderLocator.evaluate((el) => {
			return window.getComputedStyle(el).getPropertyValue('background-color');
		});

		const actualStatus = backgroundColor === 'rgb(255, 73, 164)' ? 'On' : 'Off';

		expect(actualStatus, `Stacked feature should be ${status}`).toEqual(status);
	}

	@step
	async selectTimePeriod(timePeriod: TimePeriods) {
		await this.page.getByRole('button', { name: timePeriod, exact: true }).click();
	}

	@step
	async shouldHaveStackedChartMaxY(maxY: string) {
		const regExp = new RegExp(`\\$${maxY}`);
		await expect(
			this.page.locator('[class*="recharts-yAxis-tick-labels"] tspan').last(),
			`Top Y axis legend should read ${maxY}`,
		).toContainText(regExp);
	}

	@step
	async shouldHaveTimePeriodInX(timePeriod: TimePeriods) {
		const diffInDays = {
			'7d': { days: 7, margin: 1 },
			'30d': { days: 30, margin: 2 },
			'90d': { days: 90, margin: 6 },
			'6m': { days: 180, margin: 15 },
			'1y': { days: 365, margin: 32 },
			'3y': { days: 1095, margin: 70 },
		};

		const firstChartLegend = await this.page
			.locator('[class*="recharts-xAxis-tick-labels"] tspan')
			.first()
			.textContent();

		const lastChartLegend = await this.page
			.locator('[class*="recharts-xAxis-tick-labels"] tspan')
			.last()
			.textContent();

		const actualDiffInDays =
			(Date.parse(lastChartLegend ?? 'NoDateReceived') -
				Date.parse(firstChartLegend ?? 'NoDateReceived')) /
			86400000;

		expect(actualDiffInDays).toBeGreaterThanOrEqual(
			diffInDays[timePeriod].days - diffInDays[timePeriod].margin,
		);
		expect(actualDiffInDays).toBeLessThanOrEqual(diffInDays[timePeriod].days);
	}

	@step
	async shouldHaveVaults(
		vaults: {
			name: string;
			value?: string;
			thirtyDayAPY?: string;
			nav?: string;
		}[],
	) {
		for (const vault of vaults) {
			if (vault.value) {
				const regExp = new RegExp(`\\$${vault.value}`);
				await expect(
					this.vaultLocator(vault.name).getByRole('cell').nth(1),
					`Should have $${vault.value} value`,
				).toContainText(regExp);
			}

			if (vault.thirtyDayAPY) {
				const regExp = new RegExp(`${vault.thirtyDayAPY}${vault.thirtyDayAPY === '-' ? '' : '%'}`);
				await expect(
					this.vaultLocator(vault.name).getByRole('cell').nth(2),
					`Should have ${vault.thirtyDayAPY}${vault.thirtyDayAPY === '-' ? '' : '%'} 30d APY`,
				).toContainText(regExp);
			}

			if (vault.nav) {
				const regExp = new RegExp(vault.nav);
				await expect(
					this.vaultLocator(vault.name).getByRole('cell').nth(3),
					`Should have ${vault.nav} NAV`,
				).toContainText(regExp);
			}
		}
	}

	@step
	async viewVault(vaultname: string) {
		await this.vaultLocator(vaultname).locator('a:has-text("View")').click();
	}
}
