import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';
import { ApproveStep } from './approveStep';
import { PreviewStep } from './previewStep';

export class VaultSidebar {
	readonly page: Page;

	readonly approveStep: ApproveStep;

	readonly previewStep: PreviewStep;

	readonly sidebarLocator: Locator;

	constructor(page: Page, sidebarLocator: Locator) {
		this.page = page;
		this.approveStep = new ApproveStep(page);
		this.previewStep = new PreviewStep(page);
		this.sidebarLocator = sidebarLocator;
	}

	@step
	async selectTab(tab: 'Deposit' | 'Withdraw', args?: { timeout: number }) {
		await this.sidebarLocator
			.locator(`h5:has-text("${tab}")`)
			.click({ timeout: args?.timeout ?? expectDefaultTimeout });
		await this.buttonShouldBeVisible('Withdraw');
	}

	@step
	async openTokensSelector() {
		await expect(async () => {
			await this.sidebarLocator.locator('[class*="_dropdownSelected_"]').click();
			await expect(
				this.sidebarLocator.locator('[class*="_dropdownOptions_"]'),
				'Tokens drop-downshould be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async selectToken(token: EarnTokens) {
		await this.sidebarLocator.locator(`[class*="_dropdownOption_"]:has-text("${token}")`).click();
	}

	@step
	async shouldHaveBalance({
		balance,
		token,
		timeout,
	}: {
		balance: string;
		token: EarnTokens;
		timeout?: number;
	}) {
		const regExp = new RegExp(`${balance}.*${token}`);
		await expect(this.sidebarLocator.getByText('Balance').locator('..')).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async changeNetwork(options?: { delay: number }) {
		await expect(this.sidebarLocator.getByRole('button', { name: 'Change network' })).toBeVisible();
		if (options?.delay) {
			await this.page.waitForTimeout(options.delay);
		}
		await this.sidebarLocator.getByRole('button', { name: 'Change network' }).click();
	}

	@step
	async buttonShouldBeVisible(
		button: 'Deposit' | 'Withdraw' | 'Preview',
		args?: { timeout: number }
	) {
		await expect(
			this.sidebarLocator.getByRole('button', { name: button }),
			`[${button}] button should be visible`
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async depositOrWithdraw(amount: string) {
		await this.sidebarLocator.locator('input').fill(amount);
	}

	@step
	async depositOrWithdrawAmountShouldBe({
		amount,
		tokenOrCurrency,
	}: {
		amount: string;
		tokenOrCurrency: '$' | EarnTokens;
	}) {
		const regExp = new RegExp(
			`${tokenOrCurrency === '$' ? '\\$' : ''}${amount}.*${
				tokenOrCurrency === '$' ? '' : tokenOrCurrency
			}`
		);
		await expect(this.sidebarLocator.locator('input + p')).toContainText(regExp, {
			ignoreCase: true,
		});
	}

	@step
	async shouldHaveEstimatedEarnings({ amount, token }: { amount: string; token: EarnTokens }) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(
			this.sidebarLocator.locator('p:has-text("Estimated earnings after") + p')
		).toContainText(regExp);
	}

	@step
	async preview() {
		await this.sidebarLocator.getByRole('button', { name: 'Preview' }).click();
	}

	@step
	async getStarted() {
		await this.sidebarLocator.getByRole('button', { name: 'Get Started' }).click();
	}

	@step
	async approve(token: EarnTokens) {
		await this.sidebarLocator
			.getByRole('button', { name: `Approve ${token === 'USDBC' ? 'USDbC' : token}` })
			.click();
	}

	@step
	async confirm(action: 'Deposit' | 'Withdraw') {
		await this.sidebarLocator.getByRole('button', { name: action }).click();
	}

	@step
	async goBack() {
		await this.page.locator('[class*="_goBackButton_"]').click();
	}
}
