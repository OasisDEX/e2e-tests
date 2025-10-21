import { Page } from '@playwright/test';

export class Reports {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	// TO DO - Reports panel has not beenimplemented yet
}
