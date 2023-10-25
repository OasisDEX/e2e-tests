import { expect, Page } from '@playwright/test';
import { Base } from './base';
import { OrderInformation } from './orderInformation';
import { baseUrl, positionTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

require('dotenv').config();

export class Setup {
	readonly page: Page;

	readonly base: Base;

	readonly orderInformation: OrderInformation;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
		this.orderInformation = new OrderInformation(page);
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
	async moveSlider({
		protocol,
		value,
	}: {
		protocol: 'Aave V2' | 'Aave V3' | 'Ajna' | 'Maker' | 'Spark';
		value: number;
	}) {
		if (protocol === 'Ajna') {
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
		await this.page
			.getByRole('button', { name: 'Back to editing' })
			.locator('xpath=//preceding::button[1]')
			.click();
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
		).toBeVisible();
	}

	@step
	async goToPosition() {
		await this.page.getByRole('button', { name: 'Go to position' }).click({ clickCount: 2 });
	}

	@step
	async shouldHaveLiquidationPrice({ amount, pair }: { amount: string; pair?: string }) {
		const regExp = new RegExp(`${amount}${pair ? ` ${pair}` : ''}`);

		await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toContainText(
			regExp,
			{ timeout: positionTimeout } // Liquidation price takes longer to be updated
		);
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
}
