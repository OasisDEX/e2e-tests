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
			'"Vault Risk Parameters" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Market Risk Parameters' }),
			'"Market Risk Parameters" header should be visible',
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
			'h5:has-text("Vault Risk Parameters") + * table[class*="PanelRiskParameters_table_"]',
		);

		if (vaultCap) {
			const vaultCapRegExp = new RegExp(vaultCap);
			await expect(tableLocator.getByRole('row').filter({ hasText: 'Vault Cap' })).toContainText(
				vaultCapRegExp,
			);
		}

		if (buffer) {
			const bufferRegExp = new RegExp(buffer);
			await expect(tableLocator.getByRole('row').filter({ hasText: 'Buffer' })).toContainText(
				bufferRegExp,
			);
		}
	}

	@step
	async shouldHaveMarketRiskParameters(markets: MarketRiskParameter[]) {
		const tableLocator = this.page.locator(
			'h5:has-text("Market Risk Parameters") + * table[class*="PanelRiskParameters_table_"]',
		);

		for (const market of markets) {
			const regExp = new RegExp(
				`${market.marketCap}.*${market.maxPercentage}.*${market.impliedCap}`,
			);
			await expect(
				tableLocator.getByRole('row').filter({ hasText: market.marketName }),
			).toContainText(regExp);
		}
	}

	@step
	async shouldHaveNoTransactionsInQueue() {
		await expect(
			this.page.getByText('No transactions in the queue.'),
			'Should displaye "No transactions" message',
		).toBeVisible();
	}

	@step
	async editVaultCap() {
		await this.page.getByRole('row').filter({ hasText: 'Vault Cap' }).getByText('USDC').click();
	}

	@step
	async shouldHaveEditVaultModal() {
		await expect(
			this.page.getByRole('heading', { name: 'Edit Vault Cap' }),
			'Edit Vault Cap modal should be visible',
		).toBeVisible();
	}

	@step
	async enterNewVaultCapValue(newCap: string) {
		await this.page
			.getByRole('heading', { name: 'Edit Vault Cap' })
			.locator('..')
			.locator('input')
			.fill(newCap);
	}

	@step
	async addTransaction() {
		await this.page.getByRole('button', { name: 'Add transaction' }).click();
	}

	@step
	async shouldhaveTransactionInQueue({
		riskParameter,
		newValue,
	}: {
		riskParameter: 'Vault Cap' | 'Buffer' | 'minimum buffer balance';
		newValue: string;
	}) {
		const regExp = new RegExp(
			// `[Increase|Decrease].*${riskParameter}.*from.*[0-9].*to.*${newValue}`,
			`[Increase|Decrease].*${riskParameter === 'Vault Cap' ? 'vault.*cap' : 'minimum.*buffer.*balance'}.*from.*[0-9].*to.*${newValue}`,
		);
		await expect(
			this.page.locator('[class*="_transactionItem_"]').filter({ hasText: regExp }),
			`Should show tx in queue with: ${riskParameter} - ${newValue}`,
		).toBeVisible();
	}

	@step
	async executeTransaction() {
		await this.page.getByRole('button', { name: 'Execute' }).click();
	}
}
