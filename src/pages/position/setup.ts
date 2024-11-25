import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Base } from './base';
import { OrderInformation } from './orderInformation';
import { baseUrl, expectDefaultTimeout, positionTimeout } from 'utils/config';
import { Dsr } from './dsr';
import { VaultChanges } from './vaultChanges';

export class Setup {
	readonly page: Page;

	readonly base: Base;

	readonly dsr: Dsr;

	readonly orderInformation: OrderInformation;

	readonly vaultChanges: VaultChanges;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
		this.dsr = new Dsr(page);
		this.orderInformation = new OrderInformation(page);
		this.vaultChanges = new VaultChanges(page);
	}

	@step
	async shouldHaveHeader(text: string) {
		await expect.soft(this.page.getByText(text), `${text} should be visible`).toBeVisible();
	}

	@step
	async acknowledgeAjnaInfo() {
		await this.page.getByText('I understand').click();
	}

	@step
	async shouldHaveButtonDisabled(label: string) {
		await expect(this.page.getByRole('button', { name: label })).toBeDisabled({
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveButtonEnabled(label: string) {
		await expect(this.page.getByRole('button', { name: label })).toBeEnabled({
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveSpinningIconInButton(label: string) {
		await expect(this.page.getByRole('button', { name: label }).locator('svg')).toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async shouldNotHaveSpinningIconInButton(label: string) {
		await expect(this.page.getByRole('button', { name: label }).locator('svg')).not.toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async waitForComponentToBeStable() {
		await expect(
			this.page.getByText('Historical Ratio'),
			'"Historical Ratio" should be visible'
		).toBeVisible({
			timeout: positionTimeout,
		});
		if (!baseUrl.includes('localhost') && !baseUrl.includes('3000.csb.app')) {
			await this.page.waitForTimeout(2_000); // UI elements load quickly and an extra timeout is needed
		}
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
	async stake({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Stake ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	@step
	async unstake({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Unstake ${token}`)
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
	async generate({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Generate ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
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
	async waitForSliderToBeEditable() {
		await this.base.waitForSliderToBeEditable();
	}

	/**
	 *
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async moveSlider({
		value,
		protocol,
		withWallet,
	}: {
		value: number;
		protocol?: 'Ajna' | 'Morpho' | 'Maker';
		withWallet?: boolean;
	}) {
		if (protocol) {
			await this.base.moveSlider({ value });
		} else {
			await this.base.moveSlider({ value, process: 'set up', withWallet });
		}
	}

	/**
	 *
	 * @param adjustRisk should be between '0' and '1' both included | 0: far left in slider | 1: far right
	 */
	@step
	async moveSliderOmni({ value }: { value: number }) {
		await this.base.moveSliderOmni({ value });
	}

	@step
	async showLendingPriceEditor({ pair }: { pair: string }) {
		await this.page.getByText(`Or enter specific ${pair} Lending Price`).click();
	}

	@step
	async updateLendingPrice({
		collateralToken,
		adjust,
	}: {
		collateralToken: string;
		adjust: 'up' | 'down';
	}) {
		await this.page
			.locator(`:has-text("Input ${collateralToken} Lending Price") + div > button`)
			.nth(adjust === 'down' ? 0 : 1)
			.click({ clickCount: 5 });
	}

	@step
	async createSmartDeFiAccount() {
		await this.page.getByRole('button', { name: 'Create Smart DeFi account' }).click();
	}

	@step
	async continueShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Continue' }),
			'"Continue" should be visible'
		).toBeVisible();
	}

	@step
	async continue() {
		await this.page.getByRole('button', { name: 'Continue' }).click();
	}

	@step
	async confirm() {
		await this.base.confirm();
	}

	@step
	async confirmOrRetry() {
		const confirm = this.page.getByRole('button', { name: 'Confirm' });
		const retry = this.page.getByRole('button', { name: 'Retry' });

		if (await confirm.isVisible()) {
			await confirm.click();
		} else if (await retry.isVisible()) {
			await retry.click();
		}
	}

	@step
	async setupProxyShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Set up Proxy' }),
			'"Set up Proxy" black button should be visible'
		).toBeVisible();
	}

	@step
	async setupProxy() {
		await this.page.getByRole('button', { name: 'Set up Proxy' }).click();
	}

	@step
	async setupProxy1Of4() {
		await this.page.getByRole('button', { name: 'Set up Proxy (1/4)' }).click();
	}

	@step
	async setupProxy1Of5() {
		await this.page.getByRole('button', { name: 'Set up Proxy (1/5)' }).click();
	}

	@step
	async createProxy() {
		await this.page.getByRole('button', { name: 'Create Proxy' }).click();
	}

	@step
	async createProxy2Of4() {
		await this.page.getByRole('button', { name: 'Create Proxy (2/4)' }).click();
	}

	@step
	async createProxy2Of5() {
		await this.page.getByRole('button', { name: 'Create Proxy (2/5)' }).click();
	}

	@step
	async openEarnPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Earn position (1/2)' }).click();
	}

	@step
	async setupAllowance() {
		await this.page.getByRole('button', { name: 'Set Allowance' }).click();
	}

	@step
	async unlimitedAllowance() {
		await this.page.locator('label:has-text("Unlimited Allowance")').click();
	}

	@step
	async approveAllowance() {
		await this.page.getByRole('button', { name: 'Approve Allowance' }).click();
	}

	@step
	async approveAllowanceOrRetry() {
		const approve = this.page.getByRole('button', { name: 'Approve Allowance' });
		const retry = this.page.getByRole('button', { name: 'Retry Allowance approval' });

		if (await approve.isVisible()) {
			await approve.click();
		} else if (await retry.isVisible()) {
			await retry.click();
		}
	}

	@step
	async setTokenAllowance(token: string) {
		await this.page.getByRole('button', { name: `Set ${token} allowance` }).click();
	}

	@step
	async confirmDeposit() {
		await this.page.getByRole('button', { exact: true, name: 'Deposit' }).nth(1).click();
	}

	@step
	async confirmStake() {
		await this.page.getByRole('button', { exact: true, name: 'Stake' }).nth(1).click();
	}

	@step
	async confirmUnstake() {
		await this.page.getByRole('button', { exact: true, name: 'Unstake' }).nth(1).click();
	}

	@step
	async confirmClaim() {
		await this.page.getByRole('button', { exact: true, name: 'Claim' }).nth(1).click();
	}

	@step
	async goToDeposit() {
		await this.page.getByRole('button', { name: 'Go to deposit' }).click();
	}

	@step
	async finished() {
		await this.page.getByRole('button', { exact: true, name: 'Finished' }).click();
	}

	@step
	async finishedShouldBeVisible(args?: {
		feature: 'Auto Take Profit' | 'Auto-Buy' | 'Auto-Sell' | 'Stop-Loss';
		action?: 'update' | 'remove';
	}) {
		if (args?.action === 'remove') {
			await expect(
				this.page.getByText('has been successfully cancelled'),
				'Success message should be visible'
			).toBeVisible();
		} else if (args?.feature) {
			await expect(
				this.page.getByText('You have successfully set up a'),
				'Success message should be visible'
			).toBeVisible();
		} else {
			await expect(
				this.page.getByRole('button', { exact: true, name: 'Finished' }),
				'"Finished" should be visible'
			).toBeVisible();
		}
	}

	@step
	async openBorrowPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Borrow position (1/2)' }).click();
	}

	@step
	async continueWithoutStopLoss() {
		await this.page.getByText('Continue without Stop-Loss').click();
	}

	@step
	async setupStopLoss1Of3() {
		await this.page.getByRole('button', { name: 'Set up Stop-Loss (1/3)' }).click();
	}

	@step
	async setupStopLossTransaction() {
		await this.page.getByRole('button', { name: 'Set up Stop-Loss transaction' }).click();
	}

	@step
	async setupStopLossTransactionShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Set up Stop-Loss transaction' }),
			'"Set up Stop-Loss transaction" should be visible'
		).toBeVisible({ timeout: positionTimeout });
	}

	@step
	async addStopLoss2Of3() {
		await this.page.getByRole('button', { name: 'Add Stop-Loss (2/3)' }).click();
	}

	@step
	async openMultiplyPosition1Of2() {
		await this.page.getByRole('button', { name: 'Open Multiply position (1/2)' }).click();
	}

	@step
	async createVault3Of3() {
		await this.page.getByRole('button', { name: 'Create Vault (3/3)' }).click();
	}

	@step
	async createOrRetry() {
		const create = this.page.getByRole('button', { name: 'Create' });
		const retry = this.page.getByRole('button', { name: 'Retry' });

		if (await create.isVisible()) {
			await create.click();
		} else if (await retry.isVisible()) {
			await retry.click();
		}
	}

	@step
	async shouldConfirmPositionCreation() {
		await expect(
			this.page.getByText('Position was created'),
			'"Position was created" should be visible'
		).toBeVisible();
	}

	@step
	async goToPositionShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Go to position' }),
			'"Go to position" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 6 });
	}

	@step
	async goToPosition() {
		await this.page.getByRole('button', { name: 'Go to position' }).click({ clickCount: 2 });
	}

	@step
	async goToVault() {
		await this.page.getByRole('button', { name: 'Go to Vault' }).click({ clickCount: 2 });
	}

	@step
	async goToVaultShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Go to Vault' }),
			'"Go to Vault" should be visible'
		).toBeVisible();
	}

	@step
	async getNewPositionId() {
		const id = await this.page
			.getByRole('button', { name: 'Go to position' })
			.locator('..')
			.getAttribute('href');
		return id;
	}

	@step
	async shouldHaveLiquidationPrice({
		amount,
		pair,
		exactAmount,
	}: {
		amount: string;
		pair?: string;
		exactAmount?: boolean;
	}) {
		if (exactAmount) {
			await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toHaveText(
				amount
			);
		} else {
			const regExp = new RegExp(`${amount}${pair ? ` ${pair}` : ''}`);

			await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toContainText(
				regExp,
				{ timeout: positionTimeout } // Liquidation price takes longer to be updated
			);
		}
	}

	@step
	async shouldHaveLoanToValue(percentage: string) {
		const regExp = new RegExp(`${percentage}%`);

		await expect(this.page.locator('span:has-text("Loan to Value") + span')).toContainText(regExp);
	}

	@step
	async shouldHaveCurrentPrice({ amount, pair }: { amount: string; pair: string }) {
		const regExp = new RegExp(`${amount} ${pair}`);
		await expect(this.page.locator('span:has-text("Current Price") + span')).toContainText(regExp);
	}

	@step
	async shouldHaveMinBorrowingAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp('From ' + amount + ' ' + token);
		await expect(
			this.page.locator(`span:has-text("Borrow ${token}") + span:has-text("From")`)
		).toContainText(regExp);
	}

	@step
	async shouldHaveMaxBorrowingAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp('Max ' + amount + ' ' + token);
		await expect(
			this.page.locator(`span:has-text("Borrow ${token}") + span:has-text("Max")`)
		).toContainText(regExp);
	}

	@step
	async shouldHaveError(text: string) {
		await expect(this.page.getByText(text), `${text} should be visible`).toBeVisible();
	}

	@step
	async shouldHaveWarning(...texts: string[]) {
		for (const text of texts) {
			await expect(
				this.page
					.getByRole('button', { name: 'Reset' })
					.locator('..')
					.locator('xpath=//following-sibling::div[1]')
			).toContainText(text, { timeout: positionTimeout });
		}
	}

	@step
	async depositDSR() {
		await this.page.getByRole('button', { name: 'Deposit' }).nth(1).click();
	}

	@step
	async depositDsrShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Deposit' }).nth(1),
			'"Deposit" black button should be visible'
		).toBeVisible();
	}

	@step
	async setAllowanceShouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Set Allowance' }),
			'"Set Allowance" black button should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveCollateralRatio({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(this.page.locator('p > span:has-text("Collateral Ratio") + span')).toContainText(
			regExp
		);
	}

	@step
	async shouldHaveOriginationFee({
		token,
		tokenAmount,
		dollarsAmount,
	}: {
		token: string;
		tokenAmount: string;
		dollarsAmount: string;
	}) {
		const regExp = new RegExp(`${tokenAmount} ${token} \\(\\$${dollarsAmount}\\)`);

		await expect(this.page.locator('p > span:has-text("Origination Fee") + span')).toContainText(
			regExp
		);
	}

	@step
	async shouldShowCreatingPosition() {
		await expect
			.soft(this.page.getByText('Creating your '), `"Creating your position" should be visible`)
			.toBeVisible();
	}

	@step
	async shouldShowUpdatingPosition() {
		await expect
			.soft(this.page.getByText('Updating your '), `"Updating your position" should be visible`)
			.toBeVisible();
	}

	@step
	async shouldShowSuccessScreen(args?: { depositType: 'srr' | 'cle' }) {
		if (args?.depositType) {
			await expect(
				this.page.getByText('Transaction successful.'),
				'"Transaction uccessful" should be visible'
			).toBeVisible({
				timeout: positionTimeout,
			});
		} else {
			await expect(this.page.getByText('Success'), '"Success" should be visible').toBeVisible({
				timeout: positionTimeout,
			});
		}
	}

	@step
	async openNewPosition() {
		await this.page
			.getByRole('button', { name: 'Open new position' })
			.click({ clickCount: 2, timeout: expectDefaultTimeout * 3 });
	}

	@step
	async openTokenSelector() {
		await this.page.getByTestId('deposit-token-selector').click();
	}

	@step
	async selectDepositToken(token: 'USTD' | 'ETH') {
		await this.page
			.getByTestId('deposit-token-list')
			.getByRole('listitem')
			.filter({ hasText: token })
			.click();
	}

	@step
	async getTokenSwapRate() {
		let rate: string = '';
		await expect(async () => {
			rate = await this.page.locator('p:has-text("Price (impact)") + div').innerText();
			expect(rate).toContain('.');
		}).toPass({ timeout: expectDefaultTimeout * 2 });
		const rateNumber = parseFloat(rate.slice(0, rate.indexOf(' ')).replace(',', ''));

		return rateNumber;
	}

	@step
	async getPriceImpact() {
		const impact = await this.page
			.getByRole('listitem')
			.filter({ hasText: 'Price (impact)' })
			.locator('span > span:has-text("%")')
			.innerText();
		const impactNumber = parseFloat(impact.slice(1, -2));

		return impactNumber;
	}

	@step
	async shouldHaveTransactionCostOrFee(protocol: 'Ajna' | 'Morpho Blue' | undefined) {
		await this.base.shouldHaveTransactionCostOrFee(protocol === 'Ajna' ? protocol : undefined);
	}
}
