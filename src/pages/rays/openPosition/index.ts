import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { ProductPicker } from './productPicker';
import { expectDefaultTimeout } from 'utils/config';

export class OpenPosition {
	readonly page: Page;

	readonly productPicker: ProductPicker;

	constructor(page: Page) {
		this.page = page;
		this.productPicker = new ProductPicker(page);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.page.getByRole('heading').filter({ hasText: 'Open a position' })).toBeVisible(
			{
				timeout: args?.timeout ?? expectDefaultTimeout,
			}
		);
	}

	@step
	async openBoostShouldBeVisible() {
		await expect(this.page.getByText('Boost your RAYS 2x when you open a position')).toBeVisible();
	}
}
