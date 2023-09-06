import { Page } from '@playwright/test';
import { Borrow } from './borrow';
import { Earn } from './earn';
import { Multiply } from './multiply';

export class Portfolio {
	readonly page: Page;

	readonly borrow: Borrow;

	readonly earn: Earn;

	readonly multiply: Multiply;

	constructor(page: Page) {
		this.page = page;
		this.borrow = new Borrow(page);
		this.earn = new Earn(page);
		this.multiply = new Multiply(page);
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
	}
}
