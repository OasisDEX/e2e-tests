import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Wallet {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.locator('[class*="PotfolioAssets_headerWrapper_"]').getByText('Total Assets'),
			'"Total Assets" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.locator('section:has-text("You might like")'),
			'"You might like" section should be visible'
		).toBeVisible();
	}

	@step
	async openPage(wallet: string) {
		await expect(async () => {
			await this.page.goto(`/earn/portfolio/${wallet}?tab=wallet`);
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveTotalValue(totalValue: string) {
		const regExp = new RegExp(`Total Assets\\$${totalValue}.*[0-9].[0-9]{2}% Past week`);

		await expect(
			this.page
				.locator('[class*="PotfolioAssets_headerWrapper"]')
				.locator('[class*="dataBlockWrapper"]')
		).toContainText(regExp);
	}

	// @step
	// async shouldDisplayTopThreeAssest(
	// 	assets: {
	// 		network: string;
	// 		token: string;
	// 		price: string;
	// 		usdValur: string;
	// 		tokenBalance: string;
	// 	}[]
	// ) {
	// 	const numberOfAssetsListed = await this.page.locator
	// }
}
