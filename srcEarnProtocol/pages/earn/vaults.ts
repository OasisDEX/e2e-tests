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

	byStrategy(strategy: {
		token: 'USDC' | 'USD₮0' | 'USDT' | 'ETH';
		network: 'arbitrum' | 'base' | 'ethereum';
	}) {
		return new VaultCard(
			this.page,
			this.vaultLocator
				.filter({
					has: this.page.locator(`[data-testid="vault-token"]:has-text("${strategy.token}")`),
				})
				.filter({ has: this.page.locator(`[title="earn_network_${strategy.network}"]`) })
		);
	}

	@step
	async getCount() {
		const count: number = await this.vaultLocator.count();

		return count;
	}

	@step
	async allVaultsShouldBe(network: 'arbitrum' | 'base' | 'ethereum' | 'sonic') {
		// Wait for 1st item to be displayed to avoid random fails
		await expect(this.vaultLocator.nth(0)).toBeVisible();

		const vaultsCount = await this.getCount();

		for (let i = 0; i < vaultsCount; i++) {
			const vaultNetwork = await this.nth(i).header.getNetwork();
			expect(vaultNetwork).toBe(network);
		}
	}
}
