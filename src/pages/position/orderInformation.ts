import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { positionTimeout } from 'utils/config';

export class OrderInformation {
	readonly page: Page;

	readonly orderInformationLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.orderInformationLocator = page.getByRole('list').filter({ hasText: 'Order information' }); // locator('ul:has-text("Order information")');
	}

	@step
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
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveFlashloanAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Flashloan Amount")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveFlashloanProviderLiquidity({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Flashloan Provider Liquidity")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHavePriceImpact({ amount, percentage }: { amount: string; percentage: string }) {
		const regExp = new RegExp(`${amount} \\(${percentage}%\\)`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Price (impact)")')
		).toContainText('%)', {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveSlippageLimit(amount: string) {
		const regExp = new RegExp(`${amount}%`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Slippage Limit")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveMultiply({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}x${future}x`);

		await expect(this.orderInformationLocator.locator('li:has-text("Multiply")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}

	@step
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
			timeout: positionTimeout,
		});
	}

	@step
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
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveLTV({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}% ${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("LTV")')).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveTransactionFee({ fee, token }: { fee: string; token?: string }) {
		const regExp = new RegExp(`${fee}${token ? ` ${token}` : ''} \\+ \\(n/a\\)`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Transaction fee")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveAmountToLend({
		current,
		future,
		token,
	}: {
		current: string;
		future: string;
		token: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Amount to Lend")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveNetAPY({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("Net APY")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}

	@step
	async shouldHaveLendingPrice({
		current,
		future,
		tokensPair,
	}: {
		current: string;
		future: string;
		tokensPair: string;
	}) {
		const regExp = new RegExp(`${current} ${tokensPair}${future} ${tokensPair}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Lending Price")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveMaxLTV({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("Max LTV")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}

	@step
	async shouldHaveDepositFee({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.orderInformationLocator.locator('li:has-text("Deposit fee")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}
}
