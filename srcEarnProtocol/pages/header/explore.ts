import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export type ExplorePages = '$SUMR token' | 'User Activity' | 'Rebalancing Activity' | 'Yield Trend';

export class Explore {
	readonly page: Page;

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
	async shouldList(menuOptions: ExplorePages[]) {
		for (const menuOption in menuOptions) {
			await expect(
				this.exploreLocator.getByText(menuOptions[menuOption], { exact: true })
			).toBeVisible();
		}
	}

	@step
	async select(page: ExplorePages) {
		await this.exploreLocator
			.getByRole('link')
			.filter({ has: this.page.getByText(page, { exact: true }) })
			.click();
	}
}
