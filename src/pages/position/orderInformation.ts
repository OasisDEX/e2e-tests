import { expect, Locator, Page } from '@playwright/test';
import { positionSimulationTimeout } from 'utils/config';

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
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHavePriceImpact({ amount, percentage }: { amount: string; percentage: string }) {
		const regExp = new RegExp(`${amount} \\(${percentage}%\\)`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Price (impact)")')
		).toContainText('%)', {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveSlippageLimit(amount: string) {
		const regExp = new RegExp(`${amount}%`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Slippage Limit")')
		).toContainText(regExp, {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveMultiply({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}x${future}x`);

		await expect(this.orderInformationLocator.locator('li:has-text("Multiply")')).toContainText(
			regExp,
			{
				timeout: positionSimulationTimeout,
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
			timeout: positionSimulationTimeout,
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
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveLTV({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}% ${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("LTV")')).toContainText(regExp, {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveTransactionFee({ fee, token }: { fee: string; token?: string }) {
		const regExp = new RegExp(`${fee}${token ? ` ${token}` : ''} \\+ \\(n/a\\)`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Transaction fee")')
		).toContainText(regExp, {
			timeout: positionSimulationTimeout,
		});
	}
}
