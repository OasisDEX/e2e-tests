import { expect, step } from '#institutionsFixtures';
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
		connectWallet: boolean;
		shortenedWalletAddress?: string;
	}) {
		if (logOut) {
			await expect(this.page.getByRole('button', { name: 'Log out' })).toBeVisible();
		}

		if (emailAddress) {
			await expect(this.page.getByText(emailAddress)).toBeVisible();
		}

		if (connectWallet) {
			await expect(this.page.getByRole('button', { name: 'Connect wallet' })).toBeVisible();
		}

		if (shortenedWalletAddress) {
			await expect(this.page.getByText(shortenedWalletAddress)).toBeVisible();
		}
	}
}
