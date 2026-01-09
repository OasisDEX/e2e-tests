import { expect, Page } from '@playwright/test';
import { HowItWorks } from './howItWorks';
import { VaultExposure } from './vaultExposure';
import { VaultSidebar } from '../vaultSidebar';
import { step } from '#noWalletFixtures';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class VaultPage {
	readonly page: Page;

	readonly howItWorks: HowItWorks;

	readonly exposure: VaultExposure;

	readonly sidebar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.exposure = new VaultExposure(page);
		this.howItWorks = new HowItWorks(page);
		this.sidebar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
	}

	@step
	async open(url: string) {
		await expect(async () => {
			await this.page.goto(url);

			// if (!url.includes('sonic')) {
			// 	// Reload position data to avoid random fails
			// 	await expect(this.page.locator('svg[title="refresh"]')).toBeVisible({
			// 		timeout: expectDefaultTimeout * 2,
			// 	});
			// 	await this.page.waitForTimeout(1_000);
			// 	await this.page.locator('svg[title="refresh"]').click();

			// 	await this.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}', { timeout: expectDefaultTimeout * 2 });
			// }

			await this.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}', { timeout: expectDefaultTimeout * 2 });
		}).toPass();
	}

	@step
	async shouldHave30dApy(apy: 'New strategy' | string) {
		const thirtyDayApyLocator = this.page
			.locator('[class*="_dataBlockWrapper_"]:has-text("30d APY") span')
			.first();

		if (apy === 'New strategy') {
			await expect(thirtyDayApyLocator).toContainText(apy);
		} else {
			const ApyRegExp = new RegExp(`${apy}%`);
			await expect(thirtyDayApyLocator).toContainText(ApyRegExp);

			const VsMedianRegExp = new RegExp('[0-9].[0-9]{2}%');
			await expect(
				this.page.locator(
					'[class*="_dataBlockWrapper_"]:has-text("30d APY") span:has-text("vs Median DeFi Yield")'
				)
			).toContainText(VsMedianRegExp);
		}
	}

	@step
	async shouldHaveLiveApy(apy: string, args?: { timeout: number }) {
		const ApyRegExp = new RegExp(`${apy}%`);
		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Live APY") > span').first()
		).toContainText(ApyRegExp, { timeout: args?.timeout ?? expectDefaultTimeout });

		const VsMedianRegExp = new RegExp('[0-9].[0-9]{2}%');
		await expect(
			this.page.locator(
				'[class*="_dataBlockWrapper_"]:has-text("Live APY") span:has-text("vs Median DeFi Yield")'
			)
		).toContainText(VsMedianRegExp);
	}

	@step
	async shouldHaveAssets({
		token,
		tokenAmount,
		usdAmount,
	}: {
		token: EarnTokens;
		tokenAmount: string;
		usdAmount: string;
	}) {
		const tokenRegExp = new RegExp(`${tokenAmount}.*${token}`);
		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Assets in vault") span').first()
		).toContainText(tokenRegExp);

		const usdRegExp = new RegExp(`\\$${usdAmount}`);
		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Assets in vault") span').nth(1)
		).toContainText(usdRegExp);
	}

	@step
	async shouldHaveDepositCap({ token, tokenAmount }: { token: EarnTokens; tokenAmount: string }) {
		const tokenRegExp = new RegExp(`${tokenAmount}.*${token}`);
		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Deposit Cap") span').first()
		).toContainText(tokenRegExp);

		const filledRegExp = new RegExp('[0-9]{1,2}.[0-9]{2}%');
		await expect(
			this.page.locator(
				'[class*="_dataBlockWrapper_"]:has-text("Deposit Cap") span:has-text("filled")'
			)
		).toContainText(filledRegExp);
	}

	@step
	async howItAllWorks() {
		await this.page
			.getByRole('link')
			.filter({ has: this.page.getByText('How it all works') })
			.click();
	}
}
