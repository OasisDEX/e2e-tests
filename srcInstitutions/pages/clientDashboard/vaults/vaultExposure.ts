import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class VaultExposure {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Vault exposure' }),
			'"Vault exposure" header should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveAssetAllocationBar() {
		await expect(
			this.page.getByText('Asset allocation'),
			'"Asset allocation" label should be visible'
		).toBeVisible();

		await expect(
			this.page.locator('[class*="_allocationBarItem_"]').first(),
			'Asset allocation bar should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveVaultExposurePanel() {
		await expect(
			this.page.locator('[class*="PanelVaultExposure_tableSection_"]').getByText('Buffer'),
			'"Buffer" exposure should be visible'
		).toBeVisible();
	}

	@step
	async getStrategiesTotalAllocation() {
		const allocations = (
			await this.page
				.locator(
					'[class*="PanelVaultExposure_tableSection_"] tr > td:nth-child(1) p:has-text("allocated")'
				)
				.allInnerTexts()
		).map((text) => parseFloat(text.replace('New!', '').replace('% allocated', '')));

		const totalAllocation = allocations.reduce((a, b) => a + b, 0);

		return totalAllocation;
	}

	async getStrategiesNames() {
		const strategyNames = await this.page
			.locator('[class*="PanelVaultExposure_tableSection_"]')
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
		const strategyApys = await this.page
			.locator('[class*="PanelVaultExposure_tableSection_"]')
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') })
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
