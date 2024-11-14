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
	async moveToNextVault(direction: 'Right' | 'Left', args?: { timeout: number }) {
		const arrowButtonLocator = this.page.locator(`[class*="_button${direction}_"]`);

		// Wait for button to be fully visible
		await expect(arrowButtonLocator.locator('svg')).toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});

		// Click on button
		await arrowButtonLocator.click();

		// Button should be disabled after click
		await expect(async () => {
			expect(await arrowButtonLocator.isDisabled()).toBeTruthy();
		}, 'Arrow button should be disabled').toPass();

		// Button should be enabled back after a little while
		await expect(async () => {
			expect(await arrowButtonLocator.isDisabled()).not.toBeTruthy();
		}, 'Arrow button should be enabled').toPass();
	}
}
