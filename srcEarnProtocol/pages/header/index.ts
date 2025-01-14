import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { Explore } from './explore';
import { expectDefaultTimeout } from 'utils/config';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly explore: Explore;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
		this.explore = new Explore(page, this.headerLocator);
	}

	@step
	async shouldHaveSummerfiLogo() {
		await expect(
			this.headerLocator.locator('img[alt="Summer.fi"]').nth(0),
			'Summer.fi logo should be visible'
		).toBeVisible();
	}

	@step
	async earn() {
		await this.headerLocator.getByRole('link', { name: 'Earn', exact: true }).click();
	}

	@step
	async logIn() {
		await this.headerLocator.getByRole('button', { name: 'Log in', exact: true }).click();
	}

	@step
	async shouldHaveWalletAddress(shortenedWalletAddress: string) {
		await expect(
			this.headerLocator.locator(`button:has-text("${shortenedWalletAddress}")`),
			'Button with shortened wallet address should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });
	}
}
