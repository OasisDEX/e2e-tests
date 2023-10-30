import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';

export class PoolCreator {
	readonly page: Page;

	readonly creatorLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.creatorLocator = page.locator('main:has-text("Ajna Pool Creator")');
	}

	@step
	async open() {
		await this.page.goto('/ajna/pool-creator');
	}

	@step
	async shouldHaveHeader(text: string) {
		await expect(this.creatorLocator.getByRole('heading')).toHaveText(text);
	}
}
