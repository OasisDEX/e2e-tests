import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class VaultExposure {
	readonly page: Page;

	readonly vaultExposureLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultExposureLocator = page.locator('button:has-text("Vault exposure")').locator('..');
	}

	@step
	async viewMore() {
		await this.vaultExposureLocator.getByText('View more').click();
		expect(this.vaultExposureLocator.getByText('View less')).toBeVisible();
	}

	@step
	async viewLess() {
		await this.vaultExposureLocator.getByText('View less').click();
		expect(this.vaultExposureLocator.getByText('View more')).toBeVisible();
	}

	@step
	async getStrategiesTotalAllocation() {
		const strategyAllocationLocator = this.vaultExposureLocator.locator('tr > td:nth-child(2)');
		// Wait for table to load
		await expect(strategyAllocationLocator.first()).toBeVisible();

		const viewMoreIsVisible = await this.vaultExposureLocator.getByText('View more').isVisible();
		if (viewMoreIsVisible) await this.viewMore();

		const allocations = (await strategyAllocationLocator.allInnerTexts()).map((text) =>
			parseFloat(text.replace('%', ''))
		);

		const totalAllocation = allocations.reduce((a, b) => a + b, 0);

		return totalAllocation;
	}
}
