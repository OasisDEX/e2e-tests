import { Page } from '@playwright/test';
// import { Modals } from './modals';
import { Earn, Header, LandingPage } from './pages';
import { Portfolio } from './pages';

export class App {
	readonly page: Page;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

	readonly portfolio: Portfolio;

	constructor(page: Page) {
		this.page = page;
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
		// this.modals = new Modals(page);
		this.portfolio = new Portfolio(page);
	}

	async pause() {
		await this.page.pause();
	}
}
