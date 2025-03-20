import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';

type Networks = 'Arbitrum' | 'Base' | 'Ethereum';

export class Send {
	readonly page: Page;

	readonly modalLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.modalLocator = page
			.locator('#modal-portal + [class*="_sidebarWrapper_"]:has-text("Send")')
			.locator('..');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.modalLocator.getByRole('heading', { name: 'Send' }),
			'"Send" modal should be visible'
		).toBeVisible();
	}

	@step
	async to(address: string) {
		const addressLocator = this.modalLocator.locator('input[placeholder="Recievers address"]');
		await addressLocator.clear();
		await addressLocator.fill(address);
	}

	@step
	async selectToken({ token, network }: { token: EarnTokens; network: Networks }) {
		await this.modalLocator.locator('[class*="_dropdown_"]').click();
		await expect(this.modalLocator.locator('[class*="_dropdownOptions_"]')).toHaveAttribute(
			'aria-hidden',
			'false'
		);

		await this.modalLocator
			.locator(`[class*="_dropdownOption_"]`)
			.filter({ hasText: token })
			.filter({ hasText: network })
			.click();
	}

	@step
	async shouldHaveBalance(balance: string) {
		const regExp = new RegExp(balance);
		await expect(this.modalLocator.getByText('Balance: ')).toContainText(regExp);
	}

	@step
	async enterAmount(amount: string) {
		const amountLocator = this.modalLocator.locator('[class*="_inputWrapper_"] input');
		await amountLocator.clear();
		await amountLocator.fill(amount);
	}

	@step
	async shouldHaveSummary({
		network,
		sendingAmount,
		token,
		transactionFee,
	}: {
		network: Networks;
		sendingAmount: string;
		token: EarnTokens;
		transactionFee: string;
	}) {
		await expect(
			this.modalLocator.getByRole('listitem').filter({ hasText: 'Network' }),
			`It should have network: ${network}`
		).toContainText(network);

		const sendingAmountRegExp = new RegExp(`${sendingAmount} ${token}`);
		await expect(
			this.modalLocator.getByRole('listitem').filter({ hasText: 'Sending' }),
			`It should have Sending amount: ${sendingAmount} ${token}`
		).toContainText(sendingAmountRegExp);

		const txFeeRegExp = new RegExp(`\\$${transactionFee}`);
		await expect(
			this.modalLocator.getByRole('listitem').filter({ hasText: 'Transaction fee' }),
			`It should have Transaction fee: $${transactionFee}`
		).toContainText(txFeeRegExp);
	}

	@step
	async shouldHaveSendButtonEnabled() {
		await expect(this.modalLocator.getByRole('button', { name: 'Send' })).toBeEnabled();
	}

	@step
	async sendFunds() {
		await this.modalLocator.getByRole('button', { name: 'Send' }).click();
	}
}
