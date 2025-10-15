import { expect, step } from '#institutionsFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class AdminOverview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.locator('[class*="h1"]:has-text("Institutions")')).toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}
}
