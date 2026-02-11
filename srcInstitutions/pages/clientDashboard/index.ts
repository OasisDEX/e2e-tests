import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { Feedback } from './feedback';
import { Overview } from './overview';
import { Risk } from './risk';
import { Vaults } from './vaults';

type Tabs = 'Overview' | 'Vaults' | 'Risk' | 'Fees & Revenue' | 'Reports' | 'News';

export class ClientDashboard {
	readonly page: Page;

	readonly feedback: Feedback;

	readonly overview: Overview;

	readonly risk: Risk;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.feedback = new Feedback(page);
		this.overview = new Overview(page);
		this.risk = new Risk(page);
		this.vaults = new Vaults(page);
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'Ext Demo Corp' })).toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async shouldHaveRoles({
		user,
		wallet,
	}: {
		user?: 'Viewer';
		wallet?: 'No role' | 'No wallet connected';
	}) {
		if (user) {
			await expect(this.page.locator(':has-text("User role:") + p')).toHaveText(user);
		}

		if (wallet) {
			await expect(this.page.locator(':has-text("Wallet role:") + p')).toHaveText(wallet);
		}
	}

	@step
	async shouldHaveSummary({
		totalValue,
		numberOfVaults,
		thirtyDayAPY,
		allTimePerformance,
	}: {
		totalValue?: string;
		numberOfVaults?: string;
		thirtyDayAPY?: string;
		allTimePerformance?: string;
	}) {
		const itemLocator = (label: string) =>
			this.page.locator(`[class*="_tobBlockItem_"]:has-text("${label}")`);

		if (totalValue) {
			const regExp = new RegExp(`\\$${totalValue}`);

			await expect(
				itemLocator('Total Value'),
				`Total Value should be $${totalValue}`,
			).toContainText(regExp);
		}

		if (numberOfVaults) {
			const regExp = new RegExp(numberOfVaults);

			await expect(
				itemLocator('Number of vaults'),
				`Number of vaults should be ${numberOfVaults}`,
			).toContainText(regExp);
		}

		if (thirtyDayAPY) {
			const regExp = new RegExp(`${thirtyDayAPY}%`);

			await expect(
				itemLocator('30d avg APY'),
				`30d average APY should be ${thirtyDayAPY}%`,
			).toContainText(regExp);
		}

		if (allTimePerformance) {
			const regExp = new RegExp(`\\+${allTimePerformance}%`);

			await expect(
				itemLocator('All time performance'),
				`All time performance should be +${allTimePerformance}%`,
			).toContainText(allTimePerformance === 'n/a' ? allTimePerformance : regExp);
		}
	}

	@step
	async shoulHaveTabActive(tab: Tabs) {
		await expect(
			this.page.getByRole('button', { name: tab, exact: true }),
			`${tab} tab should be underlined`,
		).toHaveAttribute('style', /tab-opacity: 1/);
	}

	@step
	async selectTab(tab: Tabs) {
		await this.page.getByRole('button', { name: tab, exact: true }).first().click();
	}
}
