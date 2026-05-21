import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Dca {
	readonly page: Page;

	readonly startingVaultBlockLocator: Locator;

	readonly targetVaultBlockLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.startingVaultBlockLocator = page
			.locator('[class*="dca_vaultDropdownWrapperFrom_"]')
			.first();
		this.targetVaultBlockLocator = page.locator('[class*="dca_vaultDropdownWrapperTo_"]').first();
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'Create DCA Strategy' })).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/dca/new');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async selectNetwork(network: 'Base' | 'Ethereum') {
		await this.page.locator('[class*="_pill_"]').filter({ hasText: network }).click();
	}

	@step
	async shouldHaveNetworkSelected(network: 'Base' | 'Ethereum') {
		await expect(this.page.locator('[class*="_pill_"]').filter({ hasText: network })).toHaveClass(
			/selected/,
		);
	}

	@step
	async openStartingVaultDropdown() {
		await this.startingVaultBlockLocator.click();
	}

	@step
	async openTargetVaultDropdown() {
		await this.targetVaultBlockLocator.click();
	}

	@step
	async shouldHaveVaultDropdownOpened(vault: 'starting' | 'target') {
		const dropdownLocator = {
			starting: this.startingVaultBlockLocator,
			target: this.targetVaultBlockLocator,
		};

		await expect(dropdownLocator[vault].locator('[class*="_dropdownOptions_"]')).toHaveClass(
			/dropdownShow/,
		);
		await expect(dropdownLocator[vault].locator('[class*="_dropdownOptions_"]')).toBeVisible();
	}

	// @step
	// async selectStartingVault({
	// 	riskManagementType,
	// 	token,
	// 	riskLevel,
	// }: {
	// 	riskManagementType: RiskManagementTypes;
	// 	token: 'ETH' | 'USDC' | 'USDT';
	// 	riskLevel?: RiskLevels;
	// }) {
	// 	await this.page.locator('[class*="dca_vaultDropdownWrapperFrom_"]').first().click();
	// }
}
