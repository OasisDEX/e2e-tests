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
		protocol,
	}: {
		tokenAmount: string;
		token: string;
		dollarsAmount: string;
		protocol?: 'Maker' | 'Ajna' | 'Morpho Blue';
	}) {
		const regExp = new RegExp(
			`${tokenAmount} ${token}${
				protocol === 'Maker' ? ' \\(' : ['Ajna', 'Morpho Blue'].includes(protocol) ? '\\(' : ' '
			}\\$${dollarsAmount}${protocol ? '\\)' : ''}`
		);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Buying") div:nth-child(2)')
		).toContainText(regExp);
	}

	@step
	async shouldHaveFlashloanAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Flashloan Amount")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveFlashloanProviderLiquidity({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Flashloan Provider Liquidity")')
		).toContainText(regExp);
	}

	@step
	async shouldHavePriceImpact({
		amount,
		percentage,
		protocol,
		pair,
	}: {
		amount: string;
		percentage: string;
		protocol?: 'Ajna' | 'Morpho Blue';
		pair?: string;
	}) {
		const regExp = new RegExp(`${amount} ${protocol ? `${pair}` : ''}\\(${percentage}%\\)`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Price (impact)")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveSlippageLimit(amount: string) {
		const regExp = new RegExp(`${amount}%`);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Slippage Limit")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveMultiply({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}x${future}x`);

		await expect(this.orderInformationLocator.locator('li:has-text("Multiply")')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveMultiple({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}x${future}x`);

		await expect(this.orderInformationLocator.locator('li:has-text("Multiple")')).toContainText(
			regExp
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
		).toContainText(regExp);
	}

	@step
	async shouldHaveDebt({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(this.orderInformationLocator.locator('li:has-text("Debt")')).toContainText(regExp);
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
		).toContainText(regExp);
	}

	@step
	async shouldHaveLTV({
		current,
		future,
		protocol,
	}: {
		current: string;
		future: string;
		protocol?: 'Ajna' | 'Morpho Blue';
	}) {
		const regExp = new RegExp(`${current}%${protocol ? '' : ' '}${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("LTV")').first()).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveTransactionFee({
		fee,
		token,
		gas,
	}: {
		fee: string;
		token?: string;
		gas?: string;
	}) {
		// const regExp = new RegExp(`${fee}${token ? ` ${token}` : ''} \\+ \\(n/a\\)`);
		const regExp = new RegExp(
			`${fee}${token ? ` ${token}` : ''}${gas ? ` \\+ \\(${gas} ETH\\)` : ''}`
		);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Transaction fee")')
		).toContainText(regExp);
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
		).toContainText(regExp);
	}

	@step
	async shouldHaveNetAPY({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("Net APY")')).toContainText(
			regExp
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
		).toContainText(regExp);
	}

	@step
	async shouldHaveMaxLTV({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.orderInformationLocator.locator('li:has-text("Max LTV")')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveDepositFee({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.orderInformationLocator.locator('li:has-text("Deposit fee")')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveTotalDeposit({ amount, token }: { amount: string; token: string }) {
		await expect(
			this.orderInformationLocator.locator(`li:has-text("Total ${token} deposit")`)
		).toContainText(amount);
	}

	@step
	async shouldHaveEstimatedTransactionCost({ fee, token }: { fee: string; token?: string }) {
		const regExp = new RegExp(`${fee}${token ? ` ${token}` : ''}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Estimated transaction cost")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveTotalSdaiToConvert(amount: string) {
		const regExp = new RegExp(amount);
		await expect(
			this.orderInformationLocator.locator('li:has-text("Total SDAI convert")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveTotalExposure({
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
			this.orderInformationLocator.locator(`li:has-text("Total ${token} exposure")`)
		).toContainText(regExp);
	}

	@step
	async shouldHaveCollateralRatio({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Collateral Ratio")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveFees(fee: string) {
		const regExp = new RegExp(`${fee} \\+\\(n/a\\)`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Fees + (max gas fee)")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveCollateralLocked({
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
			this.orderInformationLocator.locator('li:has-text("Collateral Locked")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveLiquidationPrice({
		current,
		future,
		pair,
	}: {
		current: string;
		future: string;
		pair: string;
	}) {
		const regExp = new RegExp(`${current} ${pair}${future} ${pair}`);

		await expect(
			this.orderInformationLocator.locator('li:has-text("Liquidation Price")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveAvailableToWithdraw({
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
			this.orderInformationLocator.locator('li:has-text("Available to Withdraw")')
		).toContainText(regExp);
	}

	@step
	async shouldHaveAvailableToBorrow({
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
			this.orderInformationLocator.locator('li:has-text("Available to Borrow")')
		).toContainText(regExp);
	}
}
