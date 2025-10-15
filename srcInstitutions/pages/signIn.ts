import { expect, step } from '#institutionsFixtures';
import { Page } from '@playwright/test';

export class SignIn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
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
}
