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
	async getLiquidationPrice(protocol?: 'Maker'): Promise<number> {
		return await this.base.getLiquidationPrice(protocol ?? undefined);
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
		await this.page
			.getByRole('button', { name: 'Adjust Risk' })
			.click({ timeout: expectDefaultTimeout * 3 });
	}

	@step
	async confirm() {
		await this.base.confirm();
	}

	@step
	async shouldHaveConfirmButton() {
		await this.base.shouldHaveConfirmButton();
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
		).toContainText(regExp, { timeout: positionTimeout });
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
	async payBack({ token, amount }: { token: string; amount: string }) {
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

	@step
	async withdrawDebt() {
		await this.page.getByRole('button', { name: 'Withdraw' }).click();
	}

	@step
	async reduceDebt() {
		await this.page.getByRole('button', { name: 'Reduce Debt' }).click();
	}

	@step
	async goToBorrowInterface() {
		await this.page.getByRole('button', { name: 'Go to Borrow interface' }).click();
	}

	@step
	async takeMeToTheBorrowInterface() {
		await this.page.getByRole('button', { name: 'Take me to the Borrow interface' }).click();
	}

	@step
	async multiplyThisVault() {
		await this.page.getByRole('button', { name: 'Multiply this vault' }).click();
	}

	@step
	async takeMeToTheMultiplyInterface() {
		await this.page.getByRole('button', { name: 'Take me to the Multiply interface' }).click();
	}

	@step
	async shouldHaveAutomationBoostRays({
		raysCount,
		automations,
	}: {
		raysCount: string;
		automations?: ('Stop Loss' | 'Auto Sell' | 'Auto Buy' | 'Take Profit')[];
	}) {
		const regExp = new RegExp(`${raysCount} Rays a year`);
		await expect(this.page.getByText('Boost your Rays by an extra')).toHaveText(regExp);
		if (automations) {
			for (const automation of automations) {
				await expect(
					this.page.getByText('Boost your Rays by an extra').locator('..').getByText(automation),
					`${automation} should be listed`
				).toBeVisible();
			}
		}
	}

	@step
	async shouldHaveAutomationTriggerEarnRays() {
		const regExp = new RegExp('[E-e]arn extra Rays each time automation triggers');
		await expect(this.page.getByText(regExp)).toBeVisible();
	}

	@step
	async shouldNotHaveAutomationTriggerEarnRays() {
		const regExp = new RegExp('[E-e]arn extra Rays each time automation triggers');
		await expect(this.page.getByText(regExp)).not.toBeVisible();
	}

	@step
	async shouldUpdateEarnRays() {
		const initialRaysToEarn = await this.page.getByText('Rays Instantly').innerText();
		await expect(this.page.getByText('Rays Instantly')).not.toContainText(initialRaysToEarn, {
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async shouldEarnRays(raysCount: string) {
		const regExp = new RegExp(`Earn ${raysCount}`);
		await expect(this.page.getByText('Rays Instantly')).toContainText(regExp, {
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async shouldIncreaseRays(raysCount: string) {
		const regExp = new RegExp(raysCount);
		await expect(
			this.page.getByText('You will increase your yearly Rays on this position by')
		).toContainText(regExp);
	}

	@step
	async shouldReduceRays({ raysCount, automation }: { raysCount: string; automation?: boolean }) {
		if (automation) {
			const regExp = new RegExp(
				`Reduce Rays by ${raysCount} Rays a yearWhen you remove this automation`
			);
			await expect(this.page.getByText('Reduce Rays by').locator('..')).toContainText(regExp);
		} else {
			const regExp = new RegExp(raysCount);
			await expect(
				this.page.getByText('You will reduce your yearly Rays on this position by')
			).toContainText(regExp);
		}
	}

	@step
	async shouldNotHaveReduceRays() {
		await expect(this.page.getByText('Reduce Rays by')).not.toBeVisible();
	}
}
