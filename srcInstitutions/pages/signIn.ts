import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class SignIn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('Welcome')).toBeVisible();
		await expect(this.page.getByText('Sign In')).toBeVisible();
	}

	@step
	async shouldHaveSignInButtonDisabled() {
		await expect(this.page.getByRole('button', { name: 'Sign In', exact: true })).toHaveAttribute(
			'disabled'
		);
	}

	@step
	async shouldHaveSignInButtonEnabled() {
		await expect(
			this.page.getByRole('button', { name: 'Sign In', exact: true })
		).not.toHaveAttribute('disabled');
	}

	@step
	async enterEmail(emailAddress: string) {
		await this.page.locator('input#email').fill(emailAddress);
	}

	@step
	async enterPassword(password: string) {
		await this.page.locator('input#password').fill(password);
	}

	@step
	async clearInputField(field: 'email' | 'password') {
		await this.page.locator(`input#${field}`).fill('');
	}

	@step
	async signIn() {
		await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
	}

	@step
	async shouldDisplayAuthenticationError() {
		await expect(this.page.getByText('Authentication failed')).toBeVisible();
	}

	@step
	async shouldAskFor2fa() {
		await expect(
			this.page.getByText('Two-factor authentication'),
			'2FA header should be visible'
		).toBeVisible();
		await expect(
			this.page.getByText('Enter the 6-digit code from your authenticator app'),
			'Enter code message should be visible'
		).toBeVisible();
		await expect(
			this.page.locator('input#mfaCode'),
			'2FA code input field should be visible'
		).toBeVisible();
		await expect(
			this.page.getByRole('button', { name: 'Verify' }),
			'Verify button should be visible'
		).toBeVisible();
	}

	@step
	async enter2faCode(code: string) {
		await this.page.locator('input#mfaCode').fill(code);
	}

	@step
	async verify2faCode() {
		await this.page.getByRole('button', { name: 'Verify' }).click();
	}

	@step
	async shouldDisplayInvalid2faCodeError() {
		await expect(
			this.page.locator('[class*="LoginPage_error_"]:has-text("Enter a valid 6 digit code")')
		).toBeVisible();
	}

	@step
	async shouldDisplayWrong2faCodeError() {
		await expect(
			this.page.locator('[class*="LoginPage_error_"]:has-text("MFA response failed")')
		).toBeVisible();
	}
}
