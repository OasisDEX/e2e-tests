import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class VaultExposure {
	readonly page: Page;

	readonly vaultExposureLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultExposureLocator = page.locator('button:has-text("Vault exposure")').locator('..');
	}

	@step
	async viewMore(options?: { delay: number }) {
		await this.vaultExposureLocator.getByText('View more').click({ delay: options?.delay });
		expect(this.vaultExposureLocator.getByText('View less')).toBeVisible();
	}

	@step
	async viewLess() {
		await this.vaultExposureLocator.getByText('View less').click();
		expect(this.vaultExposureLocator.getByText('View more')).toBeVisible();
	}

	async showAllStrategies() {
		// Wait for table to load
		await expect(
			this.vaultExposureLocator.locator('tr > td:nth-child(1) p:has-text("allocated")').first()
		).toBeVisible({
			timeout: expectDefaultTimeout * 2,
		});

		const viewMoreIsVisible = await this.vaultExposureLocator.getByText('View more').isVisible();
		if (viewMoreIsVisible) await this.viewMore({ delay: 500 });
	}

	@step
	async getStrategiesTotalAllocation() {
		await this.showAllStrategies();

		const allocations = (
			await this.vaultExposureLocator
				.locator('tr > td:nth-child(1) p:has-text("allocated")')
				.allInnerTexts()
		).map((text) => parseFloat(text.replace('% allocated', '')));

		const totalAllocation = allocations.reduce((a, b) => a + b, 0);

		return totalAllocation;
	}

	async getStrategiesNames() {
		await this.showAllStrategies();

		const strategyNames = await this.vaultExposureLocator
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') })
			.locator('tr td:nth-child(1) p:nth-child(1)')
			.allInnerTexts();

		return strategyNames;
	}

	@step
	async shouldNotHaveDuplicatedStrategyNames() {
		const names = await this.getStrategiesNames();

		expect(new Set(names).size).toEqual(names.length);
	}

	async getStrategiesApys() {
		await this.showAllStrategies();

		const strategyApys = await this.vaultExposureLocator
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') })
			// .locator('tr td:nth-child(2) p:nth-child(1)')
			.locator('tr td:nth-child(2) ')
			.allInnerTexts();

		return strategyApys;
	}

	@step
	async shouldNotHaveStrategyApysEqualToZero() {
		const apys = await this.getStrategiesApys();

		expect(apys.includes('0.00%')).not.toBeTruthy();
	}
}
