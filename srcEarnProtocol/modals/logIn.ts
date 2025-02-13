import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { walletTypes } from 'srcEarnProtocol/utils/types';

export class LogIn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('Log in', { exact: true })).toBeVisible();
	}

	@step
	async enterEmail(emailAddress: string) {
		await this.page.locator('input[name="email"]').fill(emailAddress);
	}

	@step
	async continue() {
		await this.page.locator('form button:has-text("Continue")').click();
	}

	@step
	async enterVerificationCode(code: string) {
		// Delay to avoid random fails
		await expect(this.page.getByText('Enter verification code')).toBeVisible();
		await this.page.waitForTimeout(1_000);

		// await this.page.locator('input[autocomplete="one-time-code"]').fill(code);

		await this.page
			.locator('input[aria-label="One time password input for the 1 digit"]')
			.fill(code[0]);
		await this.page
			.locator('input[aria-label="One time password input for the 2 digit"]')
			.fill(code[1]);
		await this.page
			.locator('input[aria-label="One time password input for the 3 digit"]')
			.fill(code[2]);
		await this.page
			.locator('input[aria-label="One time password input for the 4 digit"]')
			.fill(code[3]);
		await this.page
			.locator('input[aria-label="One time password input for the 5 digit"]')
			.fill(code[4]);
		await this.page
			.locator('input[aria-label="One time password input for the 6 digit"]')
			.fill(code[5]);
	}

	@step
	async withGoogle() {
		await this.page.getByRole('button', { name: 'Google' }).click();
	}

	@step
	async withWallet() {
		await this.page.getByRole('button', { name: 'Continue with a wallet' }).click();
	}

	@step
	async selectWallet(wallet: walletTypes) {
		await this.page.getByRole('button', { name: wallet }).click();
	}
}
