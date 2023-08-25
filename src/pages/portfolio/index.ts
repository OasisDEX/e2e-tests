import { Page } from '@playwright/test';

export class Portfolio {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
		// await this.page.goto(`/`);
	}
}
