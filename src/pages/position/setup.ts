import { expect, Page } from '@playwright/test';
import { OrderInformation } from './orderInformation';
import { positionSimulationTimeout } from 'utils/config';

require('dotenv').config();

export class Setup {
	readonly page: Page;

	readonly orderInformation: OrderInformation;

	constructor(page: Page) {
		this.page = page;
		this.orderInformation = new OrderInformation(page);
	}

	async acknowlegeAjnaInfo() {
		await this.page.getByText('I understand').click();
	}

	async waitForComponentToBeStable() {
		await expect(this.page.getByText('Historical Ratio')).toBeVisible({
			timeout: positionSimulationTimeout,
		});
		if (!process.env.BASE_URL.includes('localhost')) {
			await this.page.waitForTimeout(2_000); // UI elements load quickly and an extra timeout is needed
		}
	}

	async deposit({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Deposit ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	async borrow({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Borrow ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	async generate({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Generate ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	async waitForSliderToBeEditable() {
		await expect(async () => {
			await expect(this.page.locator('input[type="range"]')).not.toHaveAttribute('max', '0');
		}).toPass();
	}

	/**
	 *
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	async moveSlider(value: number) {
		const step = await this.page.locator('input[type="range"]').getAttribute('step');
		const min = await this.page.locator('input[type="range"]').getAttribute('min');
		const max = await this.page.locator('input[type="range"]').getAttribute('max');

		// 'fixedDecimals' is needed for Aave v3 Earn, which uses 15 decimals
		const fixedDecimals = (Math.round(parseFloat(min) * 10 ** 15) / 10 ** 15).toString().slice(5);
		const moveMIN = parseFloat(min.slice(0, 5));
		const moveMAX = parseFloat(max) - parseFloat(step);
		const sliderNewValue = (
			moveMIN +
			Math.round((moveMAX - moveMIN) * value * 1000) / 1000
		).toFixed(3);
		const sliderNewValueString = `${sliderNewValue.toString()}${fixedDecimals}`;

		await this.page.locator('input[type="range"]').fill(sliderNewValueString);
	}

	async createSmartDeFiAccount() {
		await this.page.getByRole('button', { name: 'Create Smart DeFi account' }).click();
	}

	async continueShouldBeVisible() {
		await expect(this.page.getByRole('button', { name: 'Continue' })).toBeVisible();
	}

	async continue() {
		await this.page.getByRole('button', { name: 'Continue' }).click();
	}

	async confirm() {
		await this.page.getByRole('button', { name: 'Confirm' }).click();
	}

	async confirmOrRetry() {
		await this.page
			.getByRole('button', { name: 'Back to editing' })
			.locator('xpath=//preceding::button[1]')
			.click();
	}

	async setupProxy1Of4() {
		await this.page.getByRole('button', { name: 'Setup Proxy (1/4)' }).click();
	}

	async createProxy2Of4() {
		await this.page.getByRole('button', { name: 'Create Proxy (2/4)' }).click();
	}

	async openEarnPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Earn position (1/2)' }).click();
	}

	async openBorrowPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Borrow position (1/2)' }).click();
	}

	async setupStopLoss1Of3() {
		await this.page.getByRole('button', { name: 'Setup Stop-Loss (1/3)' }).click();
	}

	async setupStopLossTransaction() {
		await this.page.getByRole('button', { name: 'Set up Stop-Loss transaction' }).click();
	}

	async addStopLoss2Of3() {
		await this.page.getByRole('button', { name: 'Add Stop-Loss (2/3)' }).click();
	}

	async openMultiplyPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Multiply position (1/2)' }).click();
	}

	async createVault3Of3() {
		await this.page.getByRole('button', { name: 'Create Vault (3/3)' }).click();
	}

	async shouldConfirmPositionCreation() {
		await expect(this.page.getByText('Position was created')).toBeVisible();
	}

	async goToPositionShouldBeVisible() {
		await expect(this.page.getByRole('button', { name: 'Go to position' })).toBeVisible();
	}

	async goToPosition() {
		await this.page.getByRole('button', { name: 'Go to position' }).click();
	}

	async shouldHaveLiquidationPrice({ amount, pair }: { amount: string; pair?: string }) {
		const regExp = new RegExp(`${amount}${pair ? ` ${pair}` : ''}`);

		await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toContainText(
			regExp,
			{ timeout: positionSimulationTimeout } // Liquidation price takes longer to be updated
		);
	}

	async shouldHaveLoanToValue(percentage: string) {
		const regExp = new RegExp(`${percentage}%`);

		await expect(this.page.locator('span:has-text("Loan to Value") + span')).toContainText(regExp);
	}

	async shouldHaveCurrentPrice({ amount, pair }: { amount: string; pair: string }) {
		const regExp = new RegExp(`${amount} ${pair}`);
		await expect(this.page.locator('span:has-text("Current Price") + span')).toContainText(regExp);
	}

	async shouldHaveMaxBorrowingAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp('Max ' + amount + ' ' + token);
		await expect(
			this.page.locator(`div:has-text("Borrow ${token}") + div:has-text("Max")`)
		).toContainText(regExp);
	}

	async shouldHaveError(text: string) {
		await expect(this.page.getByText(text)).toBeVisible();
	}

	async shouldHaveWarning(...texts: string[]) {
		for (const text of texts) {
			await expect(
				this.page
					.getByRole('button', { name: 'Reset' })
					.locator('..')
					.locator('xpath=//following-sibling::div[1]')
			).toContainText(text, { timeout: positionSimulationTimeout });
		}
	}
}
