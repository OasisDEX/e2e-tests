import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Performance' }),
			'"Performance" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'AUM' }),
			'"AUM" header should be visible',
		).toBeVisible();
	}

	@step
	async shouldHavePerformanceChart() {
		await expect(
			this.page.locator('[class*="_navPriceChart_"]'),
			'Should dispay AUM chart',
		).toBeVisible();
	}

	@step
	async shouldHaveApyChart() {
		await expect(
			this.page.locator('[class*="_arkHistoricalYieldChart_"]'),
			'Should dispay AUM chart',
		).toBeVisible();
	}

	@step
	async shouldHaveAumChart() {
		await expect(
			this.page.locator('[class*="_aumChart_"]'),
			'Should dispay AUM chart',
		).toBeVisible();
	}

	@step
	async shouldHaveContractAddresses({
		fleet,
		admiralsQuarters,
		harborCommand,
	}: {
		fleet?: string;
		admiralsQuarters?: string;
		harborCommand?: string;
	}) {
		const contractsTableRowLocator = this.page
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Contract")') })
			.locator('tr');

		if (fleet) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Fleet' })).toContainText(fleet);
		}

		if (admiralsQuarters) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Admirals Quarters' })).toContainText(
				admiralsQuarters,
			);
		}

		if (harborCommand) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Harbor Command' })).toContainText(
				harborCommand,
			);
		}
	}
}
