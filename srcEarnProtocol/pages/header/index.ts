import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { Explore } from './explore';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly explore: Explore;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
		this.explore = new Explore(page, this.headerLocator);
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

	@step
	async launchApp() {
		await this.headerLocator.getByRole('button', { name: 'Launch app' }).click();
	}
}
