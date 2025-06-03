import { Page } from '@playwright/test';
import { Banners } from './banners';
import { Modals } from './modals';
import {
	BeachClubLandingPage,
	Earn,
	Header,
	LandingPage,
	Migrate,
	Portfolio,
	PositionPage,
	RebalancingActivity,
	Sumr,
	UserActivity,
	VaultPage,
	YieldTrend,
} from './pages';
import { step } from '#noWalletFixtures';
import { expect } from '#earnProtocolFixtures';

export class App {
	readonly page: Page;

	readonly banners: Banners;

	readonly beachClubLandingPage: BeachClubLandingPage;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

	readonly migratePage: Migrate;

	readonly modals: Modals;

	readonly portfolio: Portfolio;

	readonly positionPage: PositionPage;

	readonly rebalancingActivity: RebalancingActivity;

	readonly sumr: Sumr;

	readonly userActivity: UserActivity;

	readonly vaultPage: VaultPage;

	readonly yieldTrend: YieldTrend;

	constructor(page: Page) {
		this.page = page;
		this.banners = new Banners(page);
		this.beachClubLandingPage = new BeachClubLandingPage(page);
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
		this.migratePage = new Migrate(page);
		this.modals = new Modals(page);
		this.portfolio = new Portfolio(page);
		this.positionPage = new PositionPage(page);
		this.rebalancingActivity = new RebalancingActivity(page);
		this.sumr = new Sumr(page);
		this.userActivity = new UserActivity(page);
		this.vaultPage = new VaultPage(page);
		this.yieldTrend = new YieldTrend(page);
	}

	async pause() {
		await this.page.pause();
	}

	@step
	async waitForAppToBeStable() {
		await expect(async () => {
			const loggedUserIsVisible = await this.page
				.locator('[class*="navigation"]')
				.locator('[class*="tooltip"]')
				.isVisible();
			const logInButtonIsVisible = await this.page
				.getByRole('button', { name: 'Log in', exact: true })
				.isVisible();

			expect(loggedUserIsVisible || logInButtonIsVisible).toBeTruthy();

			await this.page.waitForTimeout(1_000);

			expect(loggedUserIsVisible || logInButtonIsVisible).toBeTruthy();
		}).toPass();
	}
}
