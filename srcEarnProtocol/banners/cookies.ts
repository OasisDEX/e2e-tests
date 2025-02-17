import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Cookies {
	readonly page: Page;

	readonly bannerLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.bannerLocator = this.page.locator('[class*="_cookieBannerContent_"]');
	}

	@step
	async shouldBeVisible() {
		await expect(this.bannerLocator).toBeVisible();
	}

	@step
	async shouldBeNotVisible() {
		await expect(this.bannerLocator).not.toBeVisible();
	}

	@step
	async accept() {
		await this.bannerLocator.getByRole('button', { name: 'Accept' }).click();
	}

	@step
	async reject() {
		await this.bannerLocator.getByRole('button', { name: 'Reject' }).click();
	}
}
