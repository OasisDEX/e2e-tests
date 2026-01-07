import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

type MarketRiskParameter = {
	marketName: string;
	marketCap?: string;
	maxPercentage?: string;
	impliedCap?: string;
};

export class RiskParameters {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Vault Risk Parameters' }),
			'"Vault Risk Parameters" header should be visible'
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Market Risk Parameters' }),
			'"Market Risk Parameters" header should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveVaultRiskParameters({
		vaultCap,
		buffer,
	}: {
		vaultCap?: string;
		buffer?: string;
	}) {
		const tableLocator = this.page.locator(
			'h5:has-text("Vault Risk Parameters") + * table[class*="PanelRiskParameters_table_"]'
		);

		if (vaultCap) {
			const vaultCapRegExp = new RegExp(vaultCap);
			await expect(tableLocator.getByRole('row').filter({ hasText: 'Vault Cap' })).toContainText(
				vaultCapRegExp
			);
		}

		if (buffer) {
			const bufferRegExp = new RegExp(buffer);
			await expect(tableLocator.getByRole('row').filter({ hasText: 'Buffer' })).toContainText(
				bufferRegExp
			);
		}
	}

	@step
	async shouldHaveMarketRiskParameters(markets: MarketRiskParameter[]) {
		const tableLocator = this.page.locator(
			'h5:has-text("Market Risk Parameters") + * table[class*="PanelRiskParameters_table_"]'
		);

		for (const market of markets) {
			const regExp = new RegExp(
				`${market.marketCap}.*${market.maxPercentage}.*${market.impliedCap}`
			);
			await expect(
				tableLocator.getByRole('row').filter({ hasText: market.marketName })
			).toContainText(regExp);
		}
	}
}
