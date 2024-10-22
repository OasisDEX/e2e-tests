import { Page } from '@playwright/test';
import { ActiveSlide } from './activeSlide';
import { expect, step } from '#earnProtocolFixtures';

export class StrategiesCarousel {
	readonly page: Page;

	readonly activeSlide: ActiveSlide;

	constructor(page: Page) {
		this.page = page;
		this.activeSlide = new ActiveSlide(page);
	}

	@step
	async moveToNextStrategy(direction: 'Right' | 'Left') {
		await this.page.locator(`[class*="_button${direction}_"]`).click();

		// Button should be disabled after click
		await expect(async () => {
			expect(await this.page.locator(`[class*="_button${direction}_"]`).isDisabled()).toBeTruthy();
		}).toPass();
		// Button should be enabled back after a little while
		await expect(async () => {
			expect(
				await this.page.locator(`[class*="_button${direction}_"]`).isDisabled()
			).not.toBeTruthy();
		}).toPass();
	}
}
