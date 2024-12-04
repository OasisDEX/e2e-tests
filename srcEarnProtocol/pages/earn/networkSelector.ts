import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

type Networks = 'All Networks' | 'BASE' | 'ARBITRUM';

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

		await expect(async () => {
			// Click on drop down element
			await dropdownLocator.click({ force: true });

			// Verify dropdown options are visible - Step addedto avoidflakiness
			await expect(
				this.networksLocator
					.locator('div[class*="_dropdownOption_"]')
					.filter({ hasText: 'All Networks' })
			).toBeVisible();
		}).toPass();
	}

	@step
	async select({ option }: { option: Networks }) {
		await this.networksLocator
			.locator('div[class*="_dropdownOption_"]')
			.filter({ hasText: option })
			.click();
	}

	@step
	async shouldBe({ option }: { option: Networks }) {
		await expect(
			this.networksLocator
				.locator('div[class*="dropdownSelected"]')
				.filter({ has: this.page.locator(`span:has-text("${option}")`) })
		).toBeVisible();
	}
}
