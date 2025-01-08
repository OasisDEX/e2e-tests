import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Total Summer.fi Portfolio'),
			'"Total Summer.fi Portfolio" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('SUMR Token Rewards'),
			'"SUMR Token Rewards" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Available to Migrate'),
			'"Available to Migrate" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Positions', { exact: true }),
			'"Positions" should be visible'
		).toBeVisible();

		await expect(
			this.page.locator('section:has-text("You might like")'),
			'"You might like" section should be visible'
		).toBeVisible();
	}
}
