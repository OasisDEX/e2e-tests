import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { VaultsCarousel } from './vaultsCarousel';
import { expectDefaultTimeout } from 'utils/config';

export class LandingPage {
	readonly page: Page;

	readonly vaultsCarousel: VaultsCarousel;

	constructor(page: Page) {
		this.page = page;
		this.vaultsCarousel = new VaultsCarousel(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Automated Exposure to DeFi'),
			'"Automated Exposure..." should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('https://oasisapp.dev');
			await expect(
				this.page.getByText('Automated Exposure to DeFi'),
				'"Automated Exposure..." should be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async shouldShowVaultCard() {
		await expect(
			this.page.locator('[class*="_vaultCardHeaderWrapper"]').nth(0),
			'Vault card should be visible'
		).toBeVisible();
	}
}
