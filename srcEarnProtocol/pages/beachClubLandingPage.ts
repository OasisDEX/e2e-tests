import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class BeachClubLandingPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByRole('heading').filter({ hasText: 'with Beach Club' }),
			'"... with Beach Club" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async open() {
		await expect(async () => {
			await this.page.goto('/beach-club');
			await this.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });
		}).toPass();
	}

	@step
	async shareYourCode() {
		await this.page.getByRole('button', { name: 'Share your code' }).click();
	}
}
