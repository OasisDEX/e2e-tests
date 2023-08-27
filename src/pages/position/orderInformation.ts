import { expect, Locator, Page } from '@playwright/test';

export class OrderInformation {
	readonly page: Page;

	readonly orderInformationLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.orderInformationLocator = page.getByRole('list').filter({ hasText: 'Order information' }); // locator('ul:has-text("Order information")');
	}

	async shouldHaveBuyingAmount({
		tokenAmount,
		token,
		dollarsAmount,
	}: {
		tokenAmount: string;
		token: string;
		dollarsAmount: string;
	}) {
		const regExp = new RegExp(`${tokenAmount} ${token} \\$${dollarsAmount}`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Buying") div:nth-child(2)')
		).toContainText(regExp, {
			timeout: 10_000,
		});
	}

	async shouldHavePriceImpact({ amount, percentage }: { amount: string; percentage: string }) {
		const regExp = new RegExp(`${amount} \\(${percentage}%\\)`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Price (impact)")')
		).toContainText('%)', {
			timeout: 10_000,
		});
	}

	async shouldHaveSlippageLimit(amount: string) {
		const regExp = new RegExp(`${amount}%`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Slippage Limit")')
		).toContainText(regExp, {
			timeout: 10_000,
		});
	}

	async shouldHaveMultiply({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}x${future}x`);

		await expect(this.orderInformationLocator.locator('li:has-text("Multiply")')).toContainText(
			regExp,
			{
				timeout: 10_000,
			}
		);
	}
	async shouldHaveOutstandingDebt({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Outstanding debt")')
		).toContainText(regExp, {
			timeout: 10_000,
		});
	}

	async shouldHaveTotalCollateral({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Total collateral")')
		).toContainText(regExp, {
			timeout: 10_000,
		});
	}

	async shouldHaveLTV({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}% ${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("LTV")')).toContainText(regExp, {
			timeout: 10_000,
		});
	}

	async shouldHaveTransactionFee(fee: string) {
		await expect(
			this.orderInformationLocator.locator('li:has-text("Transaction fee")')
		).toContainText(fee, {
			timeout: 10_000,
		});
	}
}
