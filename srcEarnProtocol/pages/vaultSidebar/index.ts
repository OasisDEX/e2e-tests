import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class VaultSidebar {
	readonly page: Page;

	readonly sideBarLocator: Locator;

	constructor(page: Page, sideBarLocator: Locator) {
		this.page = page;
		this.sideBarLocator = sideBarLocator;
	}

	@step
	async openBalanceTokens() {
		await expect(async () => {
			await this.sideBarLocator.locator('[class*="_dropdownSelected_"]').click();
			await expect(
				this.sideBarLocator.locator('[class*="_dropdownOptions_"]'),
				'Tokens drop-downshould be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async selectBalanceToken(token: EarnTokens) {
		await this.sideBarLocator.locator(`[class*="_dropdownOption_"]:has-text("${token}")`).click();
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
		await expect(this.sideBarLocator.getByText('Balance').locator('..')).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async changeNetwork(options?: { delay: number }) {
		await expect(this.sideBarLocator.getByRole('button', { name: 'Change network' })).toBeVisible();
		if (options?.delay) {
			await this.page.waitForTimeout(options.delay);
		}
		await this.sideBarLocator.getByRole('button', { name: 'Change network' }).click();
	}
}
