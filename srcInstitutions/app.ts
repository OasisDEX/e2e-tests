import { Page } from '@playwright/test';
import { AdminOverview } from './pages/adminOverview';
import { ClientOverview } from './pages/clientOverview';
import { Header } from './pages/header';
import { Modals } from './modals';
import { SignIn } from './pages/signIn';

export class App {
	readonly page: Page;

	readonly adminOverview: AdminOverview;

	readonly clientOverview: ClientOverview;

	readonly header: Header;

	readonly modals: Modals;

	readonly signIn: SignIn;

	constructor(page: Page) {
		this.page = page;
		this.adminOverview = new AdminOverview(page);
		this.clientOverview = new ClientOverview(page);
		this.header = new Header(page);
		this.modals = new Modals(page);
		this.signIn = new SignIn(page);
	}

	async pause() {
		await this.page.pause();
	}
}
