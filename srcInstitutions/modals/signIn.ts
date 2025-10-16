import { step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class SignIn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async continueWithWallet() {
		await this.page.getByRole('button', { name: 'Continue with a wallet' }).click();
	}

	@step
	async metamask() {
		await this.page.getByRole('button', { name: 'MetaMask' }).click();
	}
}
