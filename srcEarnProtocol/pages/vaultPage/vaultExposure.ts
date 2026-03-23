import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class VaultExposure {
	readonly page: Page;

	readonly vaultExposureLocator: Locator;

	readonly vaultExposureTableLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultExposureLocator = page.locator('button:has-text("Vault exposure")').locator('..');
		this.vaultExposureTableLocator = this.vaultExposureLocator
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') });
	}

	@step
	async thereIsViewMoreButton(): Promise<boolean> {
		const buttonVisible = await this.vaultExposureLocator.getByText('View more').count();

		return buttonVisible >= 1;
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
			this.vaultExposureLocator.locator('tr > td:nth-child(1) p:has-text("allocated")').first(),
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
		).map((text) => parseFloat(text.replace('New!', '').replace('% allocated', '')));

		const totalAllocation = allocations.reduce((a, b) => a + b, 0);

		return totalAllocation;
	}

	async getStrategiesNames() {
		await this.showAllStrategies();

		const strategyNames = await this.vaultExposureTableLocator
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

		const strategyApys = await this.vaultExposureTableLocator
			.locator('tr td:nth-child(2) ')
			.allInnerTexts();

		return strategyApys;
	}

	async getNumberOfNotWhitelistedStrategies(): Promise<number> {
		const notWhitelistedStrategies: number = await this.vaultExposureTableLocator
			.locator('tbody tr')
			.filter({ has: this.page.locator('[style*="opacity: 0.5"]').first() })
			.count();

		return notWhitelistedStrategies;
	}

	@step
	async shouldNotHaveStrategyApysEqualToZero() {
		const apys = await this.getStrategiesApys();

		// Remove data for NOT whitelisted strategies if any
		const notWhitelistedStrategies = await this.getNumberOfNotWhitelistedStrategies();
		apys.splice(-notWhitelistedStrategies);

		//==========

		// Log strategies with APY = 0.00% and "New!" tag for debugging

		const newStrategieswithZeroApy = await this.vaultExposureTableLocator
			.locator('tbody tr')
			.filter({ hasText: 'New' })
			.filter({
				has: this.page.locator('td').nth(1).filter({ hasText: '0.00%' }),
			})
			.all();

		for (const strategy of newStrategieswithZeroApy) {
			const strategyName = await strategy.locator('td').nth(0).locator('p').nth(0).innerText();
			console.log('== newStrategiewithZeroApy: ', strategyName);
		}

		//==========

		expect(apys.includes('0.00%')).not.toBeTruthy();
	}
}
