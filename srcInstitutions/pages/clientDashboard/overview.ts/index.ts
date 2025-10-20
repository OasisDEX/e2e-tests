import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async openPage() {
		await this.page.goto('/test-client/overview/institution');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Institution overview' }),
			'Institutions overview panel should be visible'
		).toBeVisible();
	}
}
