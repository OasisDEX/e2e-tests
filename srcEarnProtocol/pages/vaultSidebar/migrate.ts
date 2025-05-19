import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Migrate {
	readonly page: Page;

	readonly migrateLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.migrateLocator = page.locator('[class*="rightBlockWrapper"]:has-text("Migrate")');
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.migrateLocator, '"Migrate" right side panel should be visible').toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async switchNetwork() {
		await this.migrateLocator.getByRole('button', { name: 'Switch network to' }).click();
	}

	@step
	async approve() {
		await this.migrateLocator.getByRole('button', { name: 'Approve' }).click();
	}

	@step
	async confirmMigrate() {
		await this.migrateLocator.getByRole('button', { name: 'Migrate' }).click();
	}
}
