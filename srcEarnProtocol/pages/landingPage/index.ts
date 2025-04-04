import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { VaultsCarousel } from './vaultsCarousel';
import { earnProtocolBaseUrl, expectDefaultTimeout } from 'utils/config';

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
			await this.page.goto(earnProtocolBaseUrl.split('/earn')[0]);
			await expect(
				this.page.getByText('Automated Exposure to DeFi'),
				'"Automated Exposure..." should be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async shouldShowVaultCard() {
		await expect(
			this.page
				.locator('[class*="homepageCarouselWrapper"] [class*="vaultCardHomepageContentWrapper"]')
				.first(),
			'Vault card should be visible'
		).toBeVisible();
	}
}
