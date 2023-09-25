import { expect, Page } from '@playwright/test';
import { positionTimeout } from 'utils/config';
import { Base } from './base';

export class Manage {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	async shouldBeVisible(header: string) {
		await expect(this.page.getByText(header).first()).toBeVisible({
			timeout: positionTimeout,
		});
	}

	async getLiquidationPrice(): Promise<number> {
		return await this.base.getLiquidationPrice();
	}

	async getLoanToValue(): Promise<number> {
		return await this.base.getLoanToValue();
	}

	async shouldHaveCollateralRatio(ratio: string) {
		const regExp = new RegExp(`${ratio}%`);

		await expect(this.page.locator('p > span:has-text("Collateral Ratio") + span')).toContainText(
			regExp
		);
	}

	async waitForSliderToBeEditable() {
		await this.base.waitForSliderToBeEditable();
	}

	/**
	 *
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	async moveSlider({ process, value }: { process: 'setup' | 'manage'; value: number }) {
		await this.base.moveSlider({ process, value });
	}

	async adjustRisk() {
		await this.page.getByRole('button', { name: 'Adjust Risk' }).click();
	}

	async confirm() {
		await this.base.confirm();
	}

	async shouldShowSuccessScreen() {
		await expect(this.page.getByText('Success!')).toBeVisible({
			timeout: positionTimeout,
		});
	}

	async ok() {
		await this.page.getByRole('button', { name: 'OK', exact: true }).click();
	}

	async openManageOptions({ currentLabel }: { currentLabel: string }) {
		await this.page.getByRole('button', { name: currentLabel, exact: true }).click();
	}

	async selectClosePosition() {
		await this.page.locator('li:has-text("Close position")').click();
	}

	async closeTo(token: string) {
		await this.page.getByRole('button', { name: `Close to ${token}` }).click();
	}

	async shouldHaveTokenAmountAfterClosing({ token, amount }: { token: string; amount: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.page
				.getByText(`${token} after closing`)
				.locator('..')
				.locator('xpath=//following-sibling::div[1]')
				.filter({ hasText: regExp })
		).toBeVisible({ timeout: positionTimeout });
	}
}
