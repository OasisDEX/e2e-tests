import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class Sumr {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('$SUMR, the token powering the best of Defi for everyone')
		).toBeVisible();
	}
}
