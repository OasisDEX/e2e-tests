import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class NetworkSelector {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async open({ currentLabel }: { currentLabel: 'All Networks' | 'base' | 'ethereum' }) {
		const dropdownLocator = this.page
			.locator('div[class*="dropdownSelected"]')
			.filter({ has: this.page.locator(`span:has-text("${currentLabel}")`) });

		// Wait for image to load to avoid random fails
		const imageLocator = dropdownLocator.locator('img').nth(0);
		await expect(imageLocator).toBeVisible();

		// Click on drop down element
		await dropdownLocator.click();
	}

	@step
	async select({ option }: { option: 'All Networks' | 'base' | 'ethereum' }) {
		await this.page
			.locator('div[class*="dropdownOptions"]')
			.filter({ has: this.page.locator(`span:has-text("${option}")`) })
			.click();
	}

	@step
	async shouldBe({ option }: { option: 'All Networks' | 'base' | 'ethereum' }) {
		await expect(
			this.page
				.locator('div[class*="dropdownSelected"]')
				.filter({ has: this.page.locator(`span:has-text("${option}")`) })
		).toBeVisible();
	}
}
