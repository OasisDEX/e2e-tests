import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class Leadership {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText(/Leadership that’s helped shape.*DeFi from day 1/),
			'It should display "Leadership that`s helped..." header',
		).toBeVisible();
	}
}
