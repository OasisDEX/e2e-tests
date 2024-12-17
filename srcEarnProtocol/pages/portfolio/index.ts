import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout, portfolioTimeout } from 'utils/config';
import { Overview } from './overview';
import { Wallet } from './wallet';
import { RebalanceActivity } from './rebalanceActivity';
import { Rewards } from './rewards';
import { YouMightLike } from './youMightLike';

export class Portfolio {
	readonly page: Page;

	readonly overview: Overview;

	readonly rebalanceActivity: RebalanceActivity;

	readonly rewards: Rewards;

	readonly wallet: Wallet;

	readonly youMightLike: YouMightLike;

	readonly portfolioSecondHeaderLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.overview = new Overview(page);
		this.rebalanceActivity = new RebalanceActivity(page);
		this.rewards = new Rewards(page);
		this.wallet = new Wallet(page);
		this.youMightLike = new YouMightLike(page);
		this.portfolioSecondHeaderLocator = this.page.locator(
			'[class*="PortfolioHeader_secondRowWrapper_"]'
		);
	}

	@step
	async shoulBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByRole('heading', { name: 'Portfolio', exact: true }),
			'"Portfolio" header shouldbe visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async open(wallet: string) {
		await this.page.goto(`/earn/portfolio/${wallet}`);
		await this.shoulBeVisible({ timeout: portfolioTimeout });
	}

	@step
	async shouldShowWalletAddress(shortenedWalletAddress: string) {
		await expect(this.portfolioSecondHeaderLocator).toContainText(shortenedWalletAddress);
	}

	@step
	async shouldShowOverviewAmounts({
		total$SUMR,
		totalWallet,
	}: {
		total$SUMR: string;
		totalWallet: string;
	}) {
		if (total$SUMR) {
			const regExp = new RegExp(total$SUMR);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total $SUMR', { exact: true }) })
					.locator('span')
			).toContainText(regExp);
		}

		if (totalWallet) {
			const regExp = new RegExp(`\\$${totalWallet}`);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total Wallet Value', { exact: true }) })
					.locator('span')
			).toContainText(regExp);
		}
	}

	@step
	async selectTab(tab: 'Wallet' | 'Rebalance Activity' | 'SUMR Rewards' | 'Overview') {
		// Wait for tabs bar to fully load
		await expect(
			this.page.locator('[class*="_tabBar_"] [class*="_underline_"]').nth(0),
			'`Tab active` bar should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 3 });

		// Select tab to switch to
		await this.page
			.locator('[class*="_tabHeaders_"]')
			.getByRole('button', { name: tab, exact: true })
			.click();
	}
}
