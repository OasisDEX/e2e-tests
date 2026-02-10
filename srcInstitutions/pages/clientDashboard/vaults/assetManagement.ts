import { expect } from '#institutionsWithWalletFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class AssetManagement {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('Vault Assets Balance')).toBeVisible();
	}

	@step
	async shouldHave({
		vaultAssetsBalance,
		walletDeposits,
		depositBalance,
		withdrawalBalance,
		timeout,
	}: {
		vaultAssetsBalance?: string;
		walletDeposits?: string;
		depositBalance?: string;
		withdrawalBalance?: string;
		timeout?: number;
	}) {
		if (vaultAssetsBalance) {
			const regExp = new RegExp(`${vaultAssetsBalance}.*USDC`);
			await expect(
				this.page.getByText('Vault Assets Balance').locator('xpath=//following-sibling::*[1]'),
				`Vault Assets Balance should be: ${regExp}`,
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (walletDeposits) {
			const regExp = new RegExp(`${walletDeposits}.*USDC`);
			await expect(
				this.page.getByText('Connected Wallet Deposits').locator('xpath=//following-sibling::*[1]'),
				`Connected Wallet Deposits should be: ${regExp}`,
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (depositBalance) {
			const regExp = new RegExp(`${depositBalance}.*USDC.*in connected wallet`);
			await expect(
				this.page.getByText('Deposit', { exact: true }).locator('xpath=//following-sibling::*[1]'),
				`Deposit balance should be: ${regExp}`,
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (withdrawalBalance) {
			const regExp = new RegExp(`${withdrawalBalance}.*USDC.*to withdraw`);
			await expect(
				this.page.getByText('Withdraw', { exact: true }).locator('xpath=//following-sibling::*[1]'),
				`Withdraw balance should be: ${regExp}`,
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}
	}

	@step
	async enterDepositAmount(amount: string) {
		await this.page.locator('input[placeholder="Amount to deposit"]').fill(amount);
	}

	@step
	async addDepositTransaction() {
		await this.page.getByRole('button', { name: 'Add deposit transaction' }).click();
	}

	@step
	async shouldHaveTransactionsInQueue(
		transactions: {
			action: 'Approve' | 'Deposit' | 'Withdraw';
			amount: string;
			token: 'USDC';
			fromAddress?: string;
		}[],
	) {
		for (const tx of transactions) {
			const regExp = new RegExp(
				`${tx.action}.*${tx.amount}.*${tx.token}${tx?.fromAddress ? `.*from.*${tx?.fromAddress}` : ''}`,
			);

			await expect(
				this.page.locator('[class*="_transactionDescription_"]').filter({ hasText: regExp }),
			).toBeVisible();
		}
	}

	@step
	async executeTx({
		action,
		amount,
		token,
	}: {
		action: 'Approve' | 'Deposit' | 'Withdraw';
		amount: string;
		token: 'USDC';
	}) {
		const regExp = new RegExp(`${action}.*${amount}.*${token}`);
		await this.page
			.locator('[class*="_transactionItem_"]')
			.filter({ hasText: regExp })
			.getByRole('button', { name: 'Execute' })
			.click();
	}

	@step
	async shouldHaveTxError({
		action,
		amount,
		token,
	}: {
		action: 'Approve' | 'Deposit' | 'Withdraw';
		amount: string;
		token: 'USDC';
	}) {
		const regExp = new RegExp(`${action}.*${amount}.*${token}`);

		await expect(
			this.page
				.locator('[class*="_transactionItem_"]')
				.filter({ hasText: regExp })
				.getByRole('button', { name: 'Transaction Error' }),
			'Button should have "Transaction Error" label',
		).toBeVisible();
	}
}
