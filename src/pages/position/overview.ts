import { expect, Page } from '@playwright/test';
import { positionSimulationTimeout } from 'utils/config';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldBeVisible() {
		await expect(this.page.getByText('Overview')).toBeVisible({
			timeout: positionSimulationTimeout,
		});
	}

	async waitForComponentToBeStable() {
		await this.shouldBeVisible();
	}

	async shouldHaveTokenAmount({ amount, token }: { amount: string; token: string }) {
		await expect(this.page.getByText('In this position').locator('../h3')).toContainText(
			`${amount} ${token}`
		);
	}

	async shouldHavePrev30daysNetValue({ token, wholePart }: { token: string; wholePart: string }) {
		const regExp = new RegExp(`${wholePart}.[0-9]{2} ${token}`);
		await expect(
			this.page.getByText('Previous 90 days*').locator('xpath=//preceding::p[1]')
		).toContainText(regExp);
	}

	async shouldHaveLiquidationPriceGreaterThanZero(token: string) {
		await expect(async () => {
			await expect(
				this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
			).toContainText(token);
		}).toPass({ timeout: positionSimulationTimeout });

		await expect(
			this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
		).not.toHaveText(`0.00 ${token}`);
	}

	/**
	 	@param price - It must be regExp string representing the the whole amount
	*/
	async shouldHaveLiquidationPrice({ price, token }: { price: string; token?: string }) {
		const regExp = new RegExp(`${price}${token ? ` ${token}` : ''}`);
		await expect(
			this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
		).toContainText(regExp, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	async shouldHaveLiquidationPriceAfterPill(price: RegExp) {
		await expect(
			this.page.getByText('Liquidation Price').locator('..').getByText('After')
		).toContainText(price, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	async shouldHaveLoanToValue(percentage: string) {
		const regExp = new RegExp(`${percentage}%`);
		await expect(
			this.page.getByText('Loan to Value').locator('xpath=//following-sibling::p[1]')
		).toHaveText(regExp, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	async shouldHaveLoanToValueAfterPill(percentage: RegExp) {
		await expect(
			this.page.getByText('Loan to Value').locator('..').getByText('After')
		).toContainText(percentage, { timeout: positionSimulationTimeout });
	}

	async shouldHaveBorrowCostGreaterThanZero() {
		await expect(async () => {
			await expect(
				this.page.getByText('Cost to Borrow').locator('xpath=//following-sibling::p[1]')
			).toContainText('%');
		}).toPass({ timeout: positionSimulationTimeout });

		await expect(
			this.page.getByText('Cost to Borrow').locator('xpath=//following-sibling::p[1]')
		).not.toHaveText('0.00%');
	}

	/**
	 	@param cost - It must be regExp representing the the whole amount
	*/
	async shouldHaveBorrowCost(cost: string) {
		const regExp = new RegExp(`${cost}%`);
		await expect(
			this.page.getByText('Cost to Borrow').locator('xpath=//following-sibling::p[1]')
		).toHaveText(regExp, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param cost - It must be regExp representing the the whole amount
	*/
	async shouldHaveBorrowCostAfterPill(cost: RegExp) {
		await expect(
			this.page.getByText('Cost to Borrow').locator('..').getByText('After')
		).toContainText(cost, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param value - It must be regExp representing the the whole amount
	*/
	async shouldHaveNetValue({ value, token }: { value: string; token?: string }) {
		const regExp = new RegExp(`${value}${token ? ` ${token}` : ''}`);
		await expect(
			this.page.getByText('Net Value').locator('xpath=//following-sibling::p[1]')
		).toHaveText(regExp, { timeout: positionSimulationTimeout });
	}

	/**
	 	@param value - It must be regExp representing the the whole amount
	*/
	async shouldHaveNetValueAfterPill(value: RegExp) {
		await expect(this.page.getByText('Net Value').locator('..').getByText('After')).toContainText(
			value,
			{ timeout: positionSimulationTimeout }
		);
	}

	async shouldHaveExposureGreaterThanZero(token: string) {
		await expect(async () => {
			await expect(this.page.locator('li:has-text("exposure") > p')).toContainText(token, {
				timeout: positionSimulationTimeout,
			});
		}).toPass();

		await expect(this.page.locator('li:has-text("exposure") > p')).not.toHaveText(
			`0.00000 ${token}`
		);
	}

	async shouldHaveExposure({ amount, token }: { amount: string; token: string }) {
		let regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("exposure") > p')).toHaveText(regExp, {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveExposureAfterPill({ amount, token }: { amount: string; token: string }) {
		let regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("exposure")').getByText('After')).toContainText(
			regExp,
			{ timeout: positionSimulationTimeout }
		);
	}

	async shouldHaveDebtGreaterThanZero(token: string) {
		await expect(async () => {
			await expect(this.page.locator('li:has-text(" Debt") > p')).toContainText(token, {
				timeout: positionSimulationTimeout,
			});
		}).toPass();

		await expect(this.page.locator('li:has-text(" Debt") > p')).not.toHaveText(`0.0000 ${token}`);
	}

	async shouldHaveDebt({ amount, token }: { amount: string; token: string }) {
		let regexObj = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text(" Debt") > p')).toHaveText(regexObj, {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveDebtAfterPill({ amount, token }: { amount: string; token: string }) {
		let regexObj = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text(" Debt")').getByText('After')).toContainText(
			regexObj,
			{ timeout: positionSimulationTimeout }
		);
	}

	async shouldHaveMultiple(amount: string) {
		let regexObj = new RegExp(`${amount}x`);

		await expect(this.page.locator('li:has-text("Multiple") > p')).toContainText(regexObj, {
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveMultipleAfterPill(amount: string) {
		let regexObj = new RegExp(`${amount}x`);

		await expect(this.page.locator('li:has-text("Multiple")').getByText('After')).toContainText(
			regexObj,
			{ timeout: positionSimulationTimeout }
		);
	}

	async shouldHaveBuyingPowerGreaterThanZero() {
		await expect(async () => {
			await expect(this.page.locator('li:has-text("Buying Power") > p')).toContainText('USD', {
				timeout: positionSimulationTimeout,
			});
		}).toPass();

		await expect(this.page.locator('li:has-text("Buying Power") > p')).not.toHaveText('0.00 USD');
	}

	async shouldHaveBuyingPower(amount: string) {
		let regexObj = new RegExp(`${amount}`);

		await expect(this.page.locator(':has-text("Buying Power") > p').nth(0)).toContainText(
			regexObj,
			{
				timeout: positionSimulationTimeout,
			}
		);
	}

	async shouldHaveBuyingPowerAfterPill(amount: string) {
		let regexObj = new RegExp(`${amount} USD`);

		await expect(this.page.locator('li:has-text("Buying Power")').getByText('After')).toContainText(
			regexObj,
			{ timeout: positionSimulationTimeout }
		);
	}

	async shouldHaveTotalCollateral({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("Total collateral")')).toContainText(regExp, {
			timeout: positionSimulationTimeout,
		});
	}
}
