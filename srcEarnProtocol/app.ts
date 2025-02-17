import { Page } from '@playwright/test';
import { Banners } from './banners';
import { Modals } from './modals';
import {
	Earn,
	Header,
	LandingPage,
	Portfolio,
	PositionPage,
	RebalancingActivity,
	Sumr,
	UserActivity,
	VaultPage,
	YieldTrend,
} from './pages';

export class App {
	readonly page: Page;

	readonly banners: Banners;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

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
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
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
}
