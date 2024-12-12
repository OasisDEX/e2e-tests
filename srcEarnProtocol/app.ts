import { Page } from '@playwright/test';
import {
	Earn,
	Header,
	LandingPage,
	Portfolio,
	VaultPage,
	RebalancingActivity,
	UserActivity,
	YieldTrend,
} from './pages';
import { Modals } from './modals';

export class App {
	readonly page: Page;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

	readonly modals: Modals;

	readonly portfolio: Portfolio;

	readonly rebalancingActivity: RebalancingActivity;

	readonly userActivity: UserActivity;

	readonly vaultPage: VaultPage;

	readonly yieldTrend: YieldTrend;

	constructor(page: Page) {
		this.page = page;
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
		this.modals = new Modals(page);
		this.portfolio = new Portfolio(page);
		this.rebalancingActivity = new RebalancingActivity(page);
		this.userActivity = new UserActivity(page);
		this.vaultPage = new VaultPage(page);
		this.yieldTrend = new YieldTrend(page);
	}

	async pause() {
		await this.page.pause();
	}
}
