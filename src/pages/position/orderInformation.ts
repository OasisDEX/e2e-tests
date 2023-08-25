import { expect, Locator, Page } from '@playwright/test';

export class OrderInformation {
	readonly page: Page;

	readonly orderInformationLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.orderInformationLocator = page.getByRole('list').filter({ hasText: 'Order information' }); // locator('ul:has-text("Order information")');
	}

	async shouldHaveBuyingAmount(token: string) {
		await expect(this.orderInformationLocator.locator('li:has-text("Buying")')).toContainText(
			`${token} $`,
			{
				timeout: 15000,
			}
		);
	}

	async shouldHavePriceImpact() {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Price (impact)")')
		).toContainText('%)', {
			timeout: 15000,
		});
	}

	async shouldHaveSlippageLimit() {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Slippage Limit")')
		).toContainText('%', {
			timeout: 15000,
		});
	}

	async shouldHaveMultiply() {
		await expect(this.orderInformationLocator.locator('li:has-text("Multiply")')).toContainText(
			'x',
			{
				timeout: 15000,
			}
		);
	}
	async shouldHaveOutstandingDebt(token: string) {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Outstanding debt")')
		).toContainText(token, {
			timeout: 15000,
		});
	}

	async shouldHaveTotalCollateral(token: string) {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Total collateral")')
		).toContainText(token, {
			timeout: 15000,
		});
	}

	async shouldHaveLTV() {
		await expect(this.orderInformationLocator.locator('li:has-text("LTV")')).toContainText('%', {
			timeout: 15000,
		});
	}

	async shouldHaveTransactionFee() {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Transaction fee")')
		).toContainText('+', {
			timeout: 15000,
		});
	}
}
