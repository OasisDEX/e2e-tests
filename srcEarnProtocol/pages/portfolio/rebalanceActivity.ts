import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class RebalanceActivity {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Rebalance actions'),
			'"Rebalance actions" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('User saved time', { exact: true }),
			'"User saved time" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Gas cost saving', { exact: true }),
			'"Gas cost saving" should be visible'
		).toBeVisible();

		await expect(
			this.page.locator('[class*="PortfolioRebalanceActivityList_wrapper_"]'),
			'Activity list should be visible'
		).toBeVisible();
	}
}
