import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { NetworkSelector } from './networkSelector';

export class Earn {
	readonly page: Page;

	readonly networkSelector: NetworkSelector;

	constructor(page: Page) {
		this.page = page;
		this.networkSelector = new NetworkSelector(page);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.locator('h2:has-text("Earn")'),
			'"Earn" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout * 2 });
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn');
			await this.shouldBeVisible();
		}).toPass();
	}
}
