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
	async shouldHaveBalance({
		balance,
		token,
		timeout,
	}: {
		balance: string;
		token: EarnTokens;
		timeout: number;
	}) {
		const regExp = new RegExp(`${balance}.*${token}`);
		await expect(this.sideBarLocator.getByText('Balance').locator('..')).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}
}
