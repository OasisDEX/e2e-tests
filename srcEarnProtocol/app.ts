import { Page } from '@playwright/test';
// import { Modals } from './modals';
import { Earn, Header, LandingPage } from './pages';

export class App {
	readonly page: Page;

	readonly earn: Earn;

	readonly header: Header;

	readonly landingPage: LandingPage;

	constructor(page: Page) {
		this.page = page;
		this.earn = new Earn(page);
		this.header = new Header(page);
		this.landingPage = new LandingPage(page);
		// this.modals = new Modals(page);
	}

	async pause() {
		await this.page.pause();
	}
}
