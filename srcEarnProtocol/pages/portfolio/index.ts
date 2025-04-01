import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { Bridge } from './bridge';
import { Overview } from './overview';
import { RebalanceActivity } from './rebalanceActivity';
import { Rewards } from './rewards';
import { Send } from './send';
import { YouMightLike } from './youMightLike';
import { YourActivity } from './yourActivity';
import { Wallet } from './wallet';

type Tabs = 'Overview' | 'Wallet' | 'Your Activity' | 'Rebalance Activity' | '$SUMR Rewards';

export class Portfolio {
	readonly page: Page;

	readonly portfolioSecondHeaderLocator: Locator;

	readonly bridge: Bridge;

	readonly overview: Overview;

	readonly rebalanceActivity: RebalanceActivity;

	readonly rewards: Rewards;

	readonly sendModal: Send;

	readonly youMightLike: YouMightLike;

	readonly yourActivity: YourActivity;

	readonly wallet: Wallet;

	constructor(page: Page) {
		this.page = page;
		this.portfolioSecondHeaderLocator = this.page.locator(
			'[class*="PortfolioHeader_secondRowWrapper_"]'
		);
		this.bridge = new Bridge(page);
		this.overview = new Overview(page);
		this.rebalanceActivity = new RebalanceActivity(page);
		this.rewards = new Rewards(page);
		this.sendModal = new Send(page);
		this.youMightLike = new YouMightLike(page);
		this.yourActivity = new YourActivity(page);
		this.wallet = new Wallet(page);
	}

	@step
	async shoulBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByRole('heading', { name: 'Portfolio' }),
			'"Portfolio" header shouldbe visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async openBridgePage() {
		await this.page.getByRole('button', { name: 'Bridge', exact: true }).click();
	}

	@step
	async open(wallet: string) {
		await expect(async () => {
			await this.page.goto(`/earn/portfolio/${wallet}`);
			await this.shoulBeVisible({ timeout: expectDefaultTimeout * 2 });
		}).toPass();
	}

	@step
	async shouldShowWalletAddress(shortenedWalletAddress: string, args?: { timeout: number }) {
		await expect(this.portfolioSecondHeaderLocator).toContainText(shortenedWalletAddress, {
			ignoreCase: true,
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldShowOverviewAmounts({
		total$SUMR,
		totalWallet,
		timeout,
	}: {
		total$SUMR: string;
		totalWallet: string;
		timeout?: number;
	}) {
		if (total$SUMR) {
			const regExp = new RegExp(total$SUMR);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total $SUMR', { exact: true }) })
					.locator('span')
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (totalWallet) {
			const regExp = new RegExp(`\\$${totalWallet}`);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total Wallet Value', { exact: true }) })
					.locator('span')
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}
	}

	@step
	async selectTab(tab: Tabs) {
		await this.page
			.locator('[class*="_tabHeaders_"]')
			.getByRole('button', { name: tab, exact: true })
			.click();
	}

	@step
	async shouldHaveTabHighlighted(tab: Tabs) {
		await expect(
			this.page.locator('[class*="_tabHeaders_"]').getByRole('button', { name: tab, exact: true })
		).toHaveClass(/active/);
	}

	@step
	async send() {
		await this.page.getByRole('button', { name: 'Send', exact: true }).click();
	}
}
