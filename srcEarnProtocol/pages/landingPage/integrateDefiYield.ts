import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class IntegrateDefiYield {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('One integration to give your users the best of DeFi'),
			'"One integration to.." header should be visible',
		).toBeVisible();
	}
}
