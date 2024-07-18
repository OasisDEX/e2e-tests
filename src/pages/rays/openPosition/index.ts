import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { ProductPicker } from './productPicker';

export class OpenPosition {
	readonly page: Page;

	readonly productPicker: ProductPicker;

	constructor(page: Page) {
		this.page = page;
		this.productPicker = new ProductPicker(page);
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('Open a position to qualify for your $RAYS')).toBeVisible();
	}

	@step
	async openBoostShouldBeVisible() {
		await expect(
			this.page.getByText('Boost your RAYS 2.5x when you open a position')
		).toBeVisible();
	}
}
