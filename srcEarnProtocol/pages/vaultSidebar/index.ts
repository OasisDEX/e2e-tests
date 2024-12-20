import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';
import { ApproveStep } from './approveStep';

export class VaultSidebar {
	readonly page: Page;

	readonly approveStep: ApproveStep;

	readonly sidebarLocator: Locator;

	constructor(page: Page, sidebarLocator: Locator) {
		this.page = page;
		this.approveStep = new ApproveStep(page);
		this.sidebarLocator = sidebarLocator;
	}

	@step
	async openBalanceTokens() {
		await expect(async () => {
			await this.sidebarLocator.locator('[class*="_dropdownSelected_"]').click();
			await expect(
				this.sidebarLocator.locator('[class*="_dropdownOptions_"]'),
				'Tokens drop-downshould be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async selectBalanceToken(token: EarnTokens) {
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
	async depositButtonShouldBeVisible() {
		await expect(this.sidebarLocator.getByRole('button', { name: 'Deposit' })).toBeVisible();
	}

	@step
	async deposit(amount: string) {
		await this.sidebarLocator.locator('input').fill(amount);
	}

	@step
	async shouldBeinUsdc(usdcAmount: string) {
		const regExp = new RegExp(`${usdcAmount}.*USDC`);
		await expect(this.sidebarLocator.locator('input + p')).toContainText(regExp);
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
	async confirmDeposit() {
		await this.sidebarLocator.getByRole('button', { name: 'Deposit' }).click();
	}
}
