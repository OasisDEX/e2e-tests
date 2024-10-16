import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
	}

	@step
	async shouldHaveSummerfiLogo() {
		await expect(
			this.headerLocator.locator('img[alt="Summer.fi"]').nth(0),
			'Summer.fi logo should be visible'
		).toBeVisible();
	}

	@step
	async earn() {
		await this.headerLocator.getByRole('link', { name: 'Earn' }).click();
	}
}
