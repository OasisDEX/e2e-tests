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
		await expect(this.page.locator('svg[title="chevron_right"]')).toBeVisible({
			timeout: expectDefaultTimeout * 2,
		});
	}

	@step
	async moveToNextVault(direction: 'right' | 'left', args?: { timeout: number }) {
		const arrowButtonLocator = this.page
			.getByRole('button')
			.filter({ has: this.page.locator(`svg[title="chevron_${direction}"]`) });

		// Click on button
		await arrowButtonLocator.click();
	}
}
