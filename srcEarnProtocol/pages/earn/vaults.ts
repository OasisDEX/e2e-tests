import { expect, Locator, Page } from '@playwright/test';
import { VaultCard } from '../vaultCard';
import { step } from '#noWalletFixtures';

export class Vaults {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly vaultLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.listLocator = page.locator('[class*="_leftBlock_"]');
		this.vaultLocator = this.listLocator.locator('[class*="_vaultCard_"]');
	}

	nth(nth: number) {
		return new VaultCard(this.page, this.vaultLocator.nth(nth));
	}

	@step
	async getCount() {
		const count: number = await this.vaultLocator.count();

		return count;
	}

	@step
	async allVaultsShouldBe(network: 'base' | 'arbitrum') {
		// Wait for 1st item to be displayed to avoid random fails
		await expect(this.vaultLocator.nth(0)).toBeVisible();

		const vaultsCount = await this.getCount();

		for (let i = 0; i < vaultsCount; i++) {
			const vaultNetwork = await this.nth(i).header.getNetwork();
			expect(vaultNetwork).toBe(network);
		}
	}
}
