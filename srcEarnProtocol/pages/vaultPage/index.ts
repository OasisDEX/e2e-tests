import { expect, Page } from '@playwright/test';
import { VaultExposure } from './vaultExposure';
import { VaultSidebar } from '../vaultSidebar';
import { step } from '#noWalletFixtures';

export class VaultPage {
	readonly page: Page;

	readonly exposure: VaultExposure;

	readonly sidebar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.exposure = new VaultExposure(page);
		this.sidebar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
	}

	@step
	async open(url: string) {
		await expect(async () => {
			await this.page.goto(url);
			await expect(
				this.page.getByText('Assets in vault'),
				'"Assets in vault" should be visible'
			).toBeVisible();
		}).toPass();
	}

	@step
	async shouldHave30dApy(apy: string) {
		const regExp = new RegExp(`${apy}%`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("30d APY") span').first()
		).toContainText(regExp);
	}

	@step
	async shouldHaveCurrentApy(apy: string) {
		const regExp = new RegExp(`${apy}%`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Current APY") span').first()
		).toContainText(regExp);
	}
}
