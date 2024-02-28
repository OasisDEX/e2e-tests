import { expect, Page } from '@playwright/test';
import { expectDefaultTimeout, positionTimeout } from 'utils/config';
import { Base } from './base';
import { step } from '#noWalletFixtures';

export class Manage {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	@step
	async shouldBeVisible(header: string) {
		await expect(this.page.getByText(header).first(), `${header} should be visible`).toBeVisible({
			timeout: positionTimeout,
		});
	}

	@step
	async getLiquidationPrice(): Promise<number> {
		return await this.base.getLiquidationPrice();
	}

	@step
	async getLoanToValue(protocol?: 'Ajna' | 'Morpho Blue'): Promise<number> {
		if (protocol) {
			return await this.base.getLoanToValue('Ajna');
		}
		return await this.base.getLoanToValue();
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
	async shouldHaveCollateralRatio(ratio: string) {
		const regExp = new RegExp(`${ratio}%`);

		await expect(this.page.locator('p > span:has-text("Collateral Ratio") + span')).toContainText(
			regExp
		);
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
			await this.base.moveSlider({ process: 'manage', value });
		}
	}

	@step
	async adjustRisk() {
		await this.page.getByRole('button', { name: 'Adjust Risk' }).click();
	}

	@step
	async confirm() {
		await this.base.confirm();
	}

	@step
	async shouldShowSuccessScreen() {
		await expect(this.page.getByText('Success!'), '"Success!" should be visible').toBeVisible({
			timeout: positionTimeout,
		});
	}

	@step
	async ok() {
		await this.page.getByRole('button', { name: 'OK', exact: true }).click();
	}

	@step
	async shouldHaveButton(
		{ label, timeout }: { label: string; timeout?: number } = {
			label: '',
			timeout: expectDefaultTimeout,
		}
	) {
		await expect(
			this.page.getByRole('button', { name: label, exact: true }),
			`Options button should read "${label}"`
		).toBeVisible({ timeout });
	}

	@step
	async openManageOptions({ currentLabel }: { currentLabel: string }) {
		await this.page.getByRole('button', { name: currentLabel, exact: true }).click();
	}

	@step
	async select(option: string) {
		await this.page.locator(`li:has-text("${option}")`).click();
	}

	@step
	async closeTo(token: string) {
		await this.page.getByRole('button', { name: `Close to ${token}` }).click();
	}

	@step
	async shouldHaveTokenAmountAfterClosing({ token, amount }: { token: string; amount: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.page
				.getByText(`${token} after closing`)
				.locator('..')
				.locator('xpath=//following-sibling::span[1]')
				.filter({ hasText: regExp }),
			`Token amount (${token} - ${amount}) should be visible`
		).toBeVisible({ timeout: positionTimeout });
	}

	@step
	async enter({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Enter ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
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
	async withdraw({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Withdraw ${token}`)
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
	async payback({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Pay back ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	@step
	async withdrawCollateral() {
		await this.page.getByRole('button', { name: 'Withdraw' }).click();
	}

	@step
	async payBackDebt() {
		await this.page.getByRole('button', { name: 'Pay back' }).click();
	}
}
