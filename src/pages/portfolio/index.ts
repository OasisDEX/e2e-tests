import { Page } from '@playwright/test';
import { Earn } from './earn';

export class Portfolio {
	readonly page: Page;

	readonly earn: Earn;

	constructor(page: Page) {
		this.page = page;
		this.earn = new Earn(page);
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
	}
}
