import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Header {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldHave({
		logOut,
		emailAddress,
		connectWallet,
		shortenedWalletAddress,
	}: {
		logOut?: boolean;
		emailAddress?: string;
		connectWallet?: boolean;
		shortenedWalletAddress?: string;
	}) {
		if (logOut) {
			await expect(
				this.page.getByRole('button', { name: 'Log out' }),
				'Log out button should be visible'
			).toBeVisible();
		}

		if (emailAddress) {
			await expect(
				this.page.getByText(emailAddress),
				`User's email address should be visible`
			).toBeVisible();
		}

		if (connectWallet) {
			await expect(
				this.page.getByRole('button', { name: 'Connect wallet' }),
				'Connect wallet button should be visible'
			).toBeVisible();
		}

		if (shortenedWalletAddress) {
			await expect(
				this.page.getByRole('button', { name: shortenedWalletAddress }),
				`User's shortened wallet address should be visible`
			).toBeVisible();
		}
	}

	@step
	async connectWallet() {
		await this.page.getByRole('button', { name: 'Connect wallet' }).click();
	}

	@step
	async shouldNothaveConnectWalletButton() {
		await expect(this.page.getByRole('button', { name: 'Connect wallet' })).not.toBeVisible();
	}
}
