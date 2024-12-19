import { Page } from '@playwright/test';
import { ActiveSlide } from './activeSlide';
import { expect, step } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class VaultsCarousel {
	readonly page: Page;

	readonly activeSlide: ActiveSlide;

	constructor(page: Page) {
		this.page = page;
		this.activeSlide = new ActiveSlide(page);
	}

	@step
	async arrowButtonShouldBevisible() {
		await expect(this.page.locator('[class*="_buttonRight_"]').locator('svg')).toBeVisible({
			timeout: expectDefaultTimeout * 2,
		});
	}

	@step
	async moveToNextVault(direction: 'Right' | 'Left', args?: { timeout: number }) {
		const arrowButtonLocator = this.page.locator(`[class*="_button${direction}_"]`);

		// Click on button
		await arrowButtonLocator.click();
	}
}
