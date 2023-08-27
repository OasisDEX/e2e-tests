import { expect, Page } from '@playwright/test';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldHaveTokenAmount({ amount, token }: { amount: string; token: string }) {
		await expect(this.page.getByText('In this position').locator('../h3')).toContainText(
			`${amount} ${token}`
		);
	}

	async shouldHavePrev30daysNetValue({ token, wholePart }: { token: string; wholePart: string }) {
		const regExp = new RegExp(`${wholePart}.[0-9]\\d ${token}`);
		await expect(
			this.page.getByText('Previous 90 days*').locator('xpath=//preceding::p[1]')
		).toContainText(regExp);
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	async shouldHaveLiquidationPriceAfterPill(price: RegExp) {
		await expect(
			this.page.getByText('Liquidation Price').locator('..').getByText('After')
		).toContainText(price);
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	async shouldHaveLoanToValueAfterPill(percentage: RegExp) {
		await expect(
			this.page.getByText('Loan to Value').locator('..').getByText('After')
		).toContainText(percentage);
	}

	/**
	 	@param cost - It must be regExp representing the the whole amount
	*/
	async shouldHaveBorrowCostAfterPill(cost: RegExp) {
		await expect(
			this.page.getByText('Net Borrow Cost').locator('..').getByText('After')
		).toContainText(cost);
	}

	/**
	 	@param cost - It must be regExp representing the the whole amount
	*/
	async shouldHaveNetValueAfterPill(cost: RegExp) {
		await expect(this.page.getByText('Net Value').locator('..').getByText('After')).toContainText(
			cost
		);
	}

	async shouldHaveExposureAfterPill({ amount, token }: { amount: string; token: string }) {
		let regexObj = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("exposure")').getByText('After')).toContainText(
			regexObj
		);
	}

	async shouldHaveDebtAfterPill({ amount, token }: { amount: string; token: string }) {
		let regexObj = new RegExp(`${amount} ${token}`);

		await expect(
			this.page.locator('li:has-text("Position Debt")').getByText('After')
		).toContainText(regexObj);
	}
}
