import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class Manage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Stake SUMR to earn rewards'),
			'"Stake SUMR to earn rewards" header shouldbe visible'
		).toBeVisible();
	}
}
