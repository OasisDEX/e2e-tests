import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';
import { expectDefaultTimeout, positionTimeout } from 'utils/config';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { tab?: 'Overview' | 'Position Info'; timeout?: number }) {
		await expect(
			this.page.getByRole('button', { name: args?.tab ?? 'Position Info', exact: true }),
			`${args?.tab ?? 'Position Info'} should be visible`
		).toBeVisible({
			timeout: args?.timeout ?? positionTimeout,
		});
	}

	@step
	async waitForComponentToBeStable(args?: { positionType?: 'Maker'; timeout?: number }) {
		if (args?.positionType) {
			await expect(
				this.page.getByText('Overview', { exact: true }),
				`"Overview" should be visible`
			).toBeVisible({
				timeout: args?.timeout ?? positionTimeout,
			});
		} else {
			await this.shouldBeVisible();
		}
	}

	@step
	async shouldHaveTokenAmount({ amount, token }: { amount: string; token: string }) {
		await expect(this.page.getByText('In this position').locator('../h3')).toContainText(
			`${amount} ${token}`
		);
	}

	@step
	async shouldHavePrev30daysNetValue({ token, amount }: { token: string; amount: string }) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.getByText('Previous 30 days*').locator('xpath=//following-sibling::*[2]')
		).toContainText(regExp);
	}

	@step
	async shouldHaveNext30daysNetValue({ token, amount }: { token: string; amount: string }) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.getByText('Next 30 days').locator('xpath=//following-sibling::*[2]')
		).toContainText(regExp);
	}

	@step
	async shouldHaveProjectedEarnings30days({ token, amount }: { token: string; amount: string }) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.getByText('Projected earnings per 30d').locator('xpath=//following-sibling::*[1]')
		).toContainText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveLiquidationPriceGreaterThanZero(token: string) {
		await expect(async () => {
			await expect(
				this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
			).toContainText(token);
		}).toPass({ timeout: positionTimeout });

		await expect(
			this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
		).not.toHaveText(`0.00 ${token}`);
	}

	/**
	 	@param price - It must be regExp string representing the the whole amount
	*/
	@step
	async shouldHaveLiquidationPrice(
		{ price, token, timeout }: { price: string; token?: string; timeout?: number } = {
			price: '',
			timeout: expectDefaultTimeout,
		}
	) {
		const regExp = new RegExp(`${token ? `${price}.*${token}` : price}`);

		await expect(
			this.page.getByText('Liquidation Price').locator('xpath=//following-sibling::p[1]')
		).toContainText(regExp, { timeout });
	}

	@step
	async shouldHaveLiquidationPriceAfterPill(price: string) {
		const regExp = new RegExp(price);
		await expect(
			this.page.getByText('Liquidation Price').locator('..').getByText('After')
		).toContainText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveLoanToValue(percentage: string) {
		const regExp = new RegExp(`${percentage}%`);
		await expect(
			this.page
				.getByText('Loan to Value', { exact: true })
				.locator('xpath=//following-sibling::p[1]')
		).toHaveText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveLoanToValueAfterPill(percentage: string) {
		const regExp = new RegExp(percentage);
		await expect(
			this.page.getByText('Loan to Value').locator('..').getByText('After')
		).toContainText(regExp);
	}

	@step
	async shouldHaveBorrowCostGreaterThanZero() {
		await expect(async () => {
			await expect(
				this.page.getByText('Cost to Borrow').locator('xpath=//following-sibling::p[1]')
			).toContainText('%');
		}).toPass({ timeout: positionTimeout });

		await expect(
			this.page.getByText('Cost to Borrow').locator('xpath=//following-sibling::p[1]')
		).not.toHaveText('0.00%');
	}

	@step
	async shouldHaveBorrowRate(rate: string) {
		const regExp = new RegExp(rate);
		await expect(this.page.locator('li:has-text("Borrow Rate")')).toHaveText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveBorrowRateAfterPill(rate: string) {
		const regExp = new RegExp(rate);
		await expect(this.page.locator('li:has-text("Borrow Rate")').getByText('After')).toContainText(
			regExp
		);
	}

	/**
	 	@param value - It must be regExp representing the the whole amount
	*/
	@step
	async shouldHaveNetValue({ value, token }: { value: string; token?: string }) {
		const regExp = new RegExp(`${value}${token ? ` ${token}` : ''}`);
		await expect(
			this.page.getByText('Net Value').locator('xpath=//following-sibling::p[1]')
		).toHaveText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveNetValueAfterPill(value: string) {
		const regExp = new RegExp(value);
		await expect(this.page.getByText('Net Value').locator('..').getByText('After')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveExposureGreaterThanZero(token: string) {
		await expect(async () => {
			await expect(this.page.locator('li:has-text("exposure") > p')).toContainText(token, {
				timeout: positionTimeout,
			});
		}).toPass();

		await expect(this.page.locator('li:has-text("exposure") > p')).not.toHaveText(
			`0.00000 ${token}`
		);
	}

	@step
	async shouldHaveExposure(
		{ amount, token, timeout }: { amount: string; token: string; timeout?: number } = {
			amount: '',
			token: '',
			timeout: expectDefaultTimeout,
		}
	) {
		let regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("exposure") > p')).toHaveText(regExp, {
			timeout,
		});
	}

	@step
	async shouldHaveExposureAfterPill({ amount, token }: { amount: string; token: string }) {
		let regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("exposure")').getByText('After')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveDebt(
		{
			amount,
			token,
			timeout,
			protocol,
		}: { amount: string; token: string; timeout?: number; protocol?: 'Ajna' | 'Morpho Blue' } = {
			amount: '',
			token: '',
			timeout: expectDefaultTimeout,
		}
	) {
		let regexObj = new RegExp(`${amount}.*${token}`);

		await expect(
			this.page.locator(`li:has-text("${protocol ? 'Position Debt' : ' Debt'}") > p`).nth(0)
		).toHaveText(regexObj, {
			timeout,
		});
	}

	@step
	async shouldHaveDebtAfterPill({
		amount,
		token,
		protocol,
	}: {
		amount: string;
		token: string;
		protocol?: 'Ajna' | 'Morpho Blue';
	}) {
		const debtElement = protocol
			? this.page.getByText('Position debt').locator('..')
			: this.page.locator('li:has-text(" Debt")');

		let regexObj = new RegExp(`${amount} ${token}`);

		await expect(debtElement.getByText('After')).toContainText(regexObj);
	}

	@step
	async shouldHaveMultiple(amount: string) {
		let regexObj = new RegExp(`${amount}x`);

		await expect(this.page.locator('li:has-text("Multiple") > p')).toContainText(regexObj, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveMultipleAfterPill(amount: string) {
		let regexObj = new RegExp(`${amount}x`);

		await expect(this.page.locator('li:has-text("Multiple")').getByText('After')).toContainText(
			regexObj
		);
	}

	@step
	async shouldHaveBuyingPowerGreaterThanZero() {
		await expect(async () => {
			await expect(this.page.locator(':has-text("Buying Power") > p').nth(0)).toContainText('$', {
				timeout: positionTimeout,
			});
		}).toPass();

		await expect(this.page.locator(':has-text("Buying Power") > p').nth(0)).not.toHaveText('$0.00');
	}

	@step
	async shouldHaveBuyingPower(amount: string) {
		let regexObj = new RegExp(amount);

		await expect(this.page.locator(':has-text("Buying Power") > p').nth(0)).toContainText(regexObj);
	}

	@step
	async shouldHaveBuyingPowerAfterPill({
		amount,
		protocol,
	}: {
		amount: string;
		protocol?: 'Maker' | 'Ajna' | 'Morpho Blue';
	}) {
		let regexObj = new RegExp(amount);
		const locator =
			protocol === 'Maker'
				? this.page.getByText('Buying Power').locator('..')
				: ['Ajna', 'Morpho Blue'].includes(protocol)
				? this.page.locator('li:has-text("Buying Power")').locator('div')
				: this.page.locator('li:has-text("Buying Power")');

		await expect(locator.getByText('After')).toContainText(regexObj);
	}

	@step
	async shouldHaveTotalCollateral({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("Total collateral")')).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveCollateralDeposited(
		{
			amount,
			token,
			timeout,
		}: {
			amount: string;
			token: string;
			timeout?: number;
		} = { amount: '', token: '', timeout: expectDefaultTimeout }
	) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(this.page.locator('li:has-text("Collateral Deposited")')).toContainText(regExp, {
			timeout,
		});
	}

	@step
	async shouldHaveCollateralDepositedAfterPill(collateral: string) {
		const regExp = new RegExp(collateral);
		await expect(
			this.page.getByText('Collateral Deposited').locator('..').getByText('After')
		).toContainText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveCollateralLocked(collateral: string) {
		const regExp = new RegExp(collateral);
		await expect(this.page.getByText('Collateral Locked').locator('..')).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveCollateralLockedAfterPill(collateral: string) {
		const regExp = new RegExp(collateral);
		await expect(
			this.page.getByText('Collateral Locked').locator('..').getByText('After')
		).toContainText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveAvailableToWithdraw({
		amount,
		token,
		timeout,
	}: {
		amount: string;
		token: string;
		timeout?: number;
	}) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("Available to Withdraw") p')).toContainText(
			regExp,
			{
				timeout: timeout ?? expectDefaultTimeout,
			}
		);
	}

	@step
	async shouldHaveAvailableToWithdrawAfterPill({
		amount,
		token,
	}: {
		amount: string;
		token: string;
	}) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.locator('li:has-text("Available to Withdraw")').getByText('After')
		).toContainText(regExp);
	}

	@step
	async shouldHaveAvailableToGenerateAfterPill({
		amount,
		token,
	}: {
		amount: string;
		token: string;
	}) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.locator('li:has-text("Available to Generate")').getByText('After')
		).toContainText(regExp);
	}

	@step
	async shouldHaveAvailableToGenerate({
		amount,
		token,
		timeout,
	}: {
		amount: string;
		token: string;
		timeout?: number;
	}) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(this.page.locator('li:has-text("Available to Generate")')).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldHaveAvailableToBorrow({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);

		await expect(this.page.locator('li:has-text("Available to Borrow") p')).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveAvailableToBorrowAfterPill({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp(`${amount} ${token}`);
		await expect(
			this.page.locator('li:has-text("Available to borrow")').getByText('After')
		).toContainText(regExp);
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	@step
	async shouldHaveCollateralizationRatio(percentage: string) {
		const regExp = new RegExp(percentage);
		await expect(this.page.getByText('Collateralization Ratio').locator('..')).toContainText(
			regExp,
			{ timeout: positionTimeout }
		);
	}

	/**
	 	@param price - It must be regExp representing the the whole amount
	*/
	@step
	async shouldHaveCollateralizationRatioAfterPill(percentage: string) {
		const regExp = new RegExp(percentage);
		await expect(
			this.page.getByText('Collateralization Ratio').locator('..').getByText('After')
		).toContainText(regExp, { timeout: positionTimeout });
	}

	@step
	async shouldHaveVaultDaiDebt(amount: string) {
		const regExp = new RegExp(`${amount} DAI`);
		await expect(this.page.locator('li:has-text("Vault Dai Debt")')).toContainText(regExp);
	}

	@step
	async shouldHaveVaultDaiDebtAfterPill(amount: string) {
		const regExp = new RegExp(`${amount} DAI`);
		await expect(
			this.page.locator('li:has-text("Vault Dai Debt")').getByText('After')
		).toContainText(regExp);
	}

	@step
	async swap() {
		await this.page.getByRole('button', { name: 'Get Started' }).click();
	}
}
