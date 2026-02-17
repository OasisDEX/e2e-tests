import { expect, Locator, Page } from '@playwright/test';
import { VaultCard } from '../vaultCard';
import { step } from '#noWalletFixtures';
import { EarnFilters, LazyNominatedTokens, Networks, Risks } from 'srcEarnProtocol/utils/types';
import {
	allAssets,
	allStables,
	allAssetsWithDuplicates,
	allStablesWithDuplicates,
} from 'srcEarnProtocol/utils/general';

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

	byStrategy(strategy: { token: LazyNominatedTokens; network: Networks; risk: Risks }) {
		return new VaultCard(
			this.page,
			this.vaultLocator
				.filter({
					has: this.page.locator(`[data-testid="vault-token"]:has-text("${strategy.token}")`),
				})
				.filter({ has: this.page.locator(`[title="earn_network_${strategy.network}"]`) })
				.filter({ hasText: strategy.risk }),
		);
	}

	@step
	async getCount() {
		const count: number = await this.vaultLocator.count();

		return count;
	}

	@step
	async allVaultsShouldBe(arg: EarnFilters) {
		// Wait for 1st item to be displayed to avoid random fails
		await expect(this.vaultLocator.nth(0)).toBeVisible();

		const vaultsCount = await this.getCount();

		// For 'All assets' and 'All stables' filters
		const assetsListed = [];
		const stableAssetsListed = [];

		for (let i = 0; i < vaultsCount; i++) {
			if (arg.filter === 'networks') {
				const vaultNetwork = await this.nth(i).header.getNetwork();
				expect(vaultNetwork).toBe(arg.network);
			}

			if (arg.filter === 'assets') {
				const vaultToken = await this.nth(i).header.getToken();
				if (arg.asset === 'All assets') {
					expect(allAssets).toContain(vaultToken);

					// For asserting all assets listed (with duplicates) outside loop
					assetsListed.push(vaultToken);
				} else if (arg.asset === 'All stables') {
					expect(allStables, `${vaultToken} should be a stable`).toContain(vaultToken);

					// For asserting all assets listed (with duplicates) outside loop
					stableAssetsListed.push(vaultToken);
				} else if (arg.asset === 'USDT') {
					expect(['USDT', 'USD₮0']).toContain(arg.asset);
				} else {
					expect(vaultToken).toBe(arg.asset);
				}
			}
		}

		// Asserting all (stable) assets listed - with duplicates

		if (arg.filter === 'assets') {
			if (arg.asset === 'All assets') {
				// Verify correct length of listed assets, with duplicates (i.e. several USDC vaults)
				expect(allAssetsWithDuplicates.length).toEqual(assetsListed.length);

				// Verify correct list of assets/vaults listed, with duplicates (i.e. several USDC vaults)
				expect(JSON.stringify([...assetsListed].sort()), `${assetsListed}`).toEqual(
					JSON.stringify([...allAssetsWithDuplicates].sort()),
				);
			} else if (arg.asset === 'All stables') {
				// Verify correct length of listed assets, with duplicates (i.e. several USDC vaults)
				expect(allStablesWithDuplicates.length).toEqual(stableAssetsListed.length);

				// Verify correct list of assets/vaults listed, with duplicates (i.e. several USDC vaults)
				expect(JSON.stringify([...stableAssetsListed].sort()), `${stableAssetsListed}`).toEqual(
					JSON.stringify([...allStablesWithDuplicates].sort()),
				);
			}
		}
	}
}
