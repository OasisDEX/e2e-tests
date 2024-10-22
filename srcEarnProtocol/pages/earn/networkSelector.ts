import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class NetworkSelector {
	readonly page: Page;

	readonly networksLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.networksLocator = page.locator(
			'[class*="_titleWithSelectWrapper_"] [class*="_dropdown_"]'
		);
	}

	@step
	async open() {
		const dropdownLocator = this.networksLocator.locator('[class*="dropdownSelected"]');
		// Wait for image to load to avoid random fails
		const imageLocator = dropdownLocator.locator('img').nth(0);
		await expect(imageLocator).toBeVisible();

		// Click on drop down element
		await dropdownLocator.click();
	}

	@step
	async select({ option }: { option: 'All Networks' | 'base' | 'ethereum' }) {
		await this.networksLocator
			.locator('div[class*="_dropdownOption_"]')
			.filter({ hasText: option })
			.click();
	}

	@step
	async shouldBe({ option }: { option: 'All Networks' | 'base' | 'ethereum' }) {
		await expect(
			this.networksLocator
				.locator('div[class*="dropdownSelected"]')
				.filter({ has: this.page.locator(`span:has-text("${option}")`) })
		).toBeVisible();
	}
}
