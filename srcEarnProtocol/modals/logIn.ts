import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { walletTypes } from 'srcEarnProtocol/utils/types';

export class LogIn {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
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
