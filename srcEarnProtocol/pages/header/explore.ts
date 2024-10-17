import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Explore {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly exploreLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.exploreLocator = headerLocator.getByRole('listitem').filter({ hasText: 'Explore' });
	}

	@step
	async open() {
		await this.exploreLocator.hover();
	}

	@step
	async shouldList(menuOptions: ('User activity' | 'Rebalancing Activity' | 'Yield Trend')[]) {
		for (const menuOption in menuOptions) {
			await expect(
				this.exploreLocator.getByText(menuOptions[menuOption], { exact: true })
			).toBeVisible();
		}
	}
}
