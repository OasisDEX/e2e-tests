import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class Dca {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'Create DCA Strategy' })).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/dca/new');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async selectNetwork(network: 'Base' | 'Ethereum') {
		await this.page.locator('[class*="_pill_"]').filter({ hasText: network }).click();
	}

	@step
	async shouldHaveNetworkSelected(network: 'Base' | 'Ethereum') {
		await expect(this.page.locator('[class*="_pill_"]').filter({ hasText: network })).toHaveClass(
			/selected/,
		);
	}
}
