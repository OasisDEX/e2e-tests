import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

type Networks = 'All Networks' | 'ARBITRUM' | 'BASE' | 'MAINNET' | 'SONIC';

export class NetworkSelector {
	readonly page: Page;

	readonly networksLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.networksLocator = page.locator('[class*="filtersGroup"] > div:has-text("All networks")');
	}

	@step
	async open() {
		await expect(async () => {
			// Click on drop down element
			await this.networksLocator.click({ force: true });

			// Verify dropdown options are visible - Step added to avoid flakiness
			await expect(
				this.networksLocator.getByRole('button').filter({ hasText: 'All networks (' })
			).toBeVisible();
		}).toPass({ timeout: expectDefaultTimeout * 2 });
	}

	@step
	async select({ option }: { option: Networks }) {
		await this.networksLocator.getByRole('listitem').filter({ hasText: option }).click();

		// Click on 'blank' area to  hide dropdown
		await this.networksLocator.click({ position: { x: 0, y: 20 } });
	}

	@step
	async shouldBe({ option }: { option: Networks }) {
		await expect(
			this.networksLocator.locator('[class*="mainWrapper"]').filter({ hasText: option })
		).toBeVisible();
	}
}
