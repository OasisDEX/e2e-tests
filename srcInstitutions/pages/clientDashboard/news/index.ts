import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class News {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	// TO DO - News panel has not beenimplemented yet
}
