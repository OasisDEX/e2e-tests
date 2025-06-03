import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { Explore } from './explore';
import { Support } from './support';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly explore: Explore;

	readonly support: Support;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
		this.explore = new Explore(page, this.headerLocator);
		this.support = new Support(page, this.headerLocator);
	}

	@step
	async shouldHaveSummerfiLogo() {
		await expect(
			this.headerLocator.locator('img[alt="Summer.fi"]').nth(0),
			'Summer.fi logo should be visible'
		).toBeVisible();
	}

	@step
	async summerfi() {
		await this.headerLocator.locator('img[alt="Summer.fi"]').nth(0).click();
	}

	@step
	async earn() {
		await this.headerLocator.getByRole('link', { name: 'Earn', exact: true }).click();
	}

	@step
	async portfolio() {
		await this.headerLocator.getByRole('link', { name: 'Portfolio', exact: true }).click();
	}

	@step
	async sumr() {
		await this.headerLocator.getByRole('link', { name: '$SUMR', exact: true }).click();
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

	@step
	async shouldShowLogInButton(timeout?: number) {
		await expect(
			this.headerLocator.getByRole('button', { name: 'Log in', exact: true }),
			'"Log in" button shouldbe visible'
		).toBeVisible({ timeout: timeout ?? expectDefaultTimeout * 2 });
	}

	@step
	async beachClub() {
		await this.page.getByRole('link', { name: 'Beach club ' }).click();
	}
}
