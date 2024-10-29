import { Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

export class Dsr {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async deposit() {
		await this.page.getByText('Deposit', { exact: true }).nth(0).click();
	}

	@step
	async mintSdai() {
		await this.page
			.getByText('Mint Savings Dai (sDAI)')
			.locator('..')
			.locator('xpath=//preceding::div[1]')
			.click();
	}

	@step
	async convert() {
		await this.page.getByText('Convert', { exact: true }).click();
	}

	@step
	async convertSdaiToDai(amount: string) {
		await this.page.getByPlaceholder('0 SDAI').fill(amount);
	}
}
