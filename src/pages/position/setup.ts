import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Base } from './base';
import { OrderInformation } from './orderInformation';
import { baseUrl, positionTimeout } from 'utils/config';
import { Dsr } from './dsr';
import { VaultChanges } from './vaultChanges';

require('dotenv').config();

export class Setup {
	readonly page: Page;

	readonly base: Base;

	readonly dsr: Dsr;

	readonly orderInformation: OrderInformation;

	readonly vaultChanges: VaultChanges;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
		this.dsr = new Dsr(page);
		this.orderInformation = new OrderInformation(page);
		this.vaultChanges = new VaultChanges(page);
	}

	@step
	async shouldHaveHeader(text: string) {
		await expect.soft(this.page.getByText(text), `${text} should be visible`).toBeVisible();
	}

	@step
	async acknowlegeAjnaInfo() {
		await this.page.getByText('I understand').click();
	}

	@step
	async shouldHaveButtonDisabled(label: string) {
		await expect(this.page.getByRole('button', { name: label })).toBeDisabled({
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveButtonEnabled(label: string) {
		await expect(this.page.getByRole('button', { name: label })).toBeEnabled({
			timeout: positionTimeout,
		});
	}

	@step
	async waitForComponentToBeStable() {
		await expect(
			this.page.getByText('Historical Ratio'),
			'"Historical Ratio" should be visible'
		).toBeVisible({
			timeout: positionTimeout,
		});
		if (!baseUrl.includes('localhost') && !baseUrl.includes('3000.csb.app')) {
			await this.page.waitForTimeout(2_000); // UI elements load quickly and an extra timeout is needed
		}
	}

	@step
	async deposit({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Deposit ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	@step
	async borrow({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Borrow ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	@step
	async generate({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Generate ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	@step
	async getLendingPrice(): Promise<number> {
		return await this.base.getLendingPrice();
	}

	@step
	async getMaxLTV(): Promise<number> {
		return await this.base.getMaxLTV();
	}

	@step
	async waitForSliderToBeEditable() {
		await this.base.waitForSliderToBeEditable();
	}

	/**
	 *
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async moveSlider({ protocol, value }: { protocol?: 'Ajna'; value: number }) {
		if (protocol) {
			await this.base.moveSlider({ value });
		} else {
			await this.base.moveSlider({ process: 'setup', value });
		}
	}

	@step
	async createSmartDeFiAccount() {
		await this.page.getByRole('button', { name: 'Create Smart DeFi account' }).click();
	}

	@step
	async continueShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Continue' }),
			'"Continue" should be visible'
		).toBeVisible();
	}

	@step
	async continue() {
		await this.page.getByRole('button', { name: 'Continue' }).click();
	}

	@step
	async confirm() {
		await this.base.confirm();
	}

	@step
	async confirmOrRetry() {
		const confirm = this.page.getByRole('button', { name: 'Confirm' });
		const retry = this.page.getByRole('button', { name: 'Retry' });

		if (await confirm.isVisible()) {
			await confirm.click();
		} else if (await retry.isVisible()) {
			await retry.click();
		}
	}

	@step
	async setupProxyShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Setup Proxy' }),
			'"Setup Proxy" black button should be visible'
		).toBeVisible();
	}

	@step
	async setupProxy() {
		await this.page.getByRole('button', { name: 'Setup Proxy' }).click();
	}

	@step
	async setupProxy1Of4() {
		await this.page.getByRole('button', { name: 'Setup Proxy (1/4)' }).click();
	}

	@step
	async createProxy2Of4() {
		await this.page.getByRole('button', { name: 'Create Proxy (2/4)' }).click();
	}

	@step
	async openEarnPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Earn position (1/2)' }).click();
	}

	@step
	async setupAllowance() {
		await this.page.getByRole('button', { name: 'Set Allowance' }).click();
	}

	@step
	async unlimitedAllowance() {
		await this.page.locator('label:has-text("Unlimited Allowance")').click();
	}

	@step
	async approveAllowance() {
		await this.page.getByRole('button', { name: 'Approve Allowance' }).click();
	}

	@step
	async goToDeposit() {
		await this.page.getByRole('button', { name: 'Go to deposit' }).click();
	}

	@step
	async confirmDeposit() {
		await this.page.getByRole('button', { exact: true, name: 'Deposit' }).nth(1).click();
	}

	@step
	async finished() {
		await this.page.getByRole('button', { exact: true, name: 'Finished' }).click();
	}

	@step
	async openBorrowPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Borrow position (1/2)' }).click();
	}

	@step
	async setupStopLoss1Of3() {
		await this.page.getByRole('button', { name: 'Setup Stop-Loss (1/3)' }).click();
	}

	@step
	async setupStopLossTransaction() {
		await this.page.getByRole('button', { name: 'Set up Stop-Loss transaction' }).click();
	}

	@step
	async setupStopLossTransactionShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Set up Stop-Loss transaction' }),
			'"Set up Stop-Loss transaction", should be visible'
		).toBeVisible({ timeout: positionTimeout });
	}

	@step
	async addStopLoss2Of3() {
		await this.page.getByRole('button', { name: 'Add Stop-Loss (2/3)' }).click();
	}

	@step
	async openMultiplyPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Multiply position (1/2)' }).click();
	}

	@step
	async createVault3Of3() {
		await this.page.getByRole('button', { name: 'Create Vault (3/3)' }).click();
	}

	@step
	async shouldConfirmPositionCreation() {
		await expect(
			this.page.getByText('Position was created'),
			'"Position was created" should be visible'
		).toBeVisible();
	}

	@step
	async goToPositionShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Go to position' }),
			'"Go to position" should be visible'
		).toBeVisible({ timeout: 10_000 });
	}

	@step
	async goToPosition() {
		await this.page.getByRole('button', { name: 'Go to position' }).click({ clickCount: 2 });
	}

	@step
	async shouldHaveLiquidationPrice({
		amount,
		pair,
		exactAmount,
	}: {
		amount: string;
		pair?: string;
		exactAmount?: boolean;
	}) {
		if (exactAmount) {
			await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toHaveText(
				amount
			);
		} else {
			const regExp = new RegExp(`${amount}${pair ? ` ${pair}` : ''}`);

			await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toContainText(
				regExp,
				{ timeout: positionTimeout } // Liquidation price takes longer to be updated
			);
		}
	}

	@step
	async shouldHaveLoanToValue(percentage: string) {
		const regExp = new RegExp(`${percentage}%`);

		await expect(this.page.locator('span:has-text("Loan to Value") + span')).toContainText(regExp);
	}

	@step
	async shouldHaveCurrentPrice({ amount, pair }: { amount: string; pair: string }) {
		const regExp = new RegExp(`${amount} ${pair}`);
		await expect(this.page.locator('span:has-text("Current Price") + span')).toContainText(regExp);
	}

	@step
	async shouldHaveMaxBorrowingAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp('Max ' + amount + ' ' + token);
		await expect(
			this.page.locator(`span:has-text("Borrow ${token}") + span:has-text("Max")`)
		).toContainText(regExp);
	}

	@step
	async shouldHaveError(text: string) {
		await expect(this.page.getByText(text), `${text} should be visible`).toBeVisible();
	}

	@step
	async shouldHaveWarning(...texts: string[]) {
		for (const text of texts) {
			await expect(
				this.page
					.getByRole('button', { name: 'Reset' })
					.locator('..')
					.locator('xpath=//following-sibling::div[1]')
			).toContainText(text, { timeout: positionTimeout });
		}
	}

	@step
	async depositDSR() {
		await this.page.getByRole('button', { name: 'Deposit' }).nth(1).click();
	}

	@step
	async depositDsrShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Deposit' }).nth(1),
			'"Deposit" black button should be visible'
		).toBeVisible();
	}

	@step
	async setAllowanceShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Set Allowance' }),
			'"Set Allowance" black button should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveCollateralRatio({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.page.locator('p > span:has-text("Collateral Ratio") + span')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveOriginationFee({
		token,
		tokenAmount,
		dollarsAmount,
	}: {
		token: string;
		tokenAmount: string;
		dollarsAmount: string;
	}) {
		const regExp = new RegExp(`${tokenAmount} ${token} \\(\\$${dollarsAmount}\\)`);

		await expect(this.page.locator('p > span:has-text("Origination Fee") + span')).toContainText(
			regExp
		);
	}
}
