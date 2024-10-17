import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Earn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.locator('h2:has-text("Earn")'),
			'"Earn" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout * 2 });
	}
}
