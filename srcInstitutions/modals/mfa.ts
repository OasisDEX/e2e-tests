import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Mfa {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Multi-factor authentication'),
			'MFA modal header should be visible'
		).toBeVisible();
	}

	@step
	async shouldBeDisabled() {
		await expect(
			this.page.getByText('MFA is currently disabled'),
			'MFA is disabled message should be visible'
		).toBeVisible();
	}

	@step
	async setUpMfa() {
		await this.page.getByRole('button', { name: 'Set up MFA' }).click();
	}

	@step
	async shouldHaveQrCodeAndSecret() {
		await expect(
			this.page.getByText('Scan this QR code'),
			'Scan QR code message should be visible'
		).toBeVisible();
		await expect(
			this.page.locator('a > img[alt="TOTP QR code"]'),
			'QR code should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Or enter secret manually'),
			'Secret message should be visible'
		).toBeVisible();
		await expect(
			this.page.locator('textarea[class*="MFASetting_"]'),
			'Secret key should be visible'
		).toBeVisible();
	}

	@step
	async verifyAndEnable() {
		await this.page.getByRole('button', { name: 'Verify $ enable' }).click();
	}
}
