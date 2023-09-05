import { Page } from '@playwright/test';
import { Borrow } from './borrow';
import { Earn } from './earn';

export class Portfolio {
	readonly page: Page;

	readonly borrow: Borrow;

	readonly earn: Earn;

	constructor(page: Page) {
		this.page = page;
		this.borrow = new Borrow(page);
		this.earn = new Earn(page);
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
	}
}
