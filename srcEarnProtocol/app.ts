import { Page } from '@playwright/test';
// import { Modals } from './modals';
import {
	Earn,
	Header,
	LandingPage,
	Portfolio,
	RebalancingActivity,
	UserActivity,
	YieldTrend,
} from './pages';

export class App {
	readonly page: Page;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

	readonly portfolio: Portfolio;

	readonly rebalancingActivity: RebalancingActivity;

	readonly userActivity: UserActivity;

	readonly yieldTrend: YieldTrend;

	constructor(page: Page) {
		this.page = page;
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
		// this.modals = new Modals(page);
		this.portfolio = new Portfolio(page);
		this.rebalancingActivity = new RebalancingActivity(page);
		this.userActivity = new UserActivity(page);
		this.yieldTrend = new YieldTrend(page);
	}

	async pause() {
		await this.page.pause();
	}
}
