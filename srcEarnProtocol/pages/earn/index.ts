import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { NetworkSelector } from './networkSelector';
import { Vaults } from './vaults';
import { VaultSidebar } from '../vaultSidebar';

export class Earn {
	readonly page: Page;

	readonly networkSelector: NetworkSelector;

	readonly sidebar: VaultSidebar;

	readonly sumrBlockLocator: Locator;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.networkSelector = new NetworkSelector(page);
		this.sidebar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
		this.sumrBlockLocator = page
			.locator('[class*="_gradientBoxWrapper_"]')
			.filter({ has: page.locator('[class*="_sumrStakeCard_"]') });
		this.vaults = new Vaults(page);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.locator('h2:has-text("Earn")'),
			'"Earn" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout * 2 });
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async sumrBlockShouldHave({
		sumrRewardApy,
		availableToStake,
		usdcYield,
	}: {
		sumrRewardApy?: string;
		availableToStake?: { sumrAmount?: string; usdAmount?: string };
		usdcYield?: { maxRate?: string; maxUsdPerYear?: string };
	}) {
		if (sumrRewardApy) {
			const regExp = new RegExp(`${sumrRewardApy}%`);
			await expect(this.sumrBlockLocator.getByText('SUMR Reward APY up to').first()).toContainText(
				regExp
			);
		}

		if (availableToStake?.sumrAmount) {
			const regExp = new RegExp(`${availableToStake.sumrAmount}.*SUMR`);
			await expect(
				this.sumrBlockLocator
					.getByText('Available to stake')
					.locator('xpath=//following-sibling::*[1]')
			).toContainText(regExp);
		}

		if (availableToStake?.usdAmount) {
			const regExp = new RegExp(`\\$.*${availableToStake.usdAmount}`);
			await expect(
				this.sumrBlockLocator
					.getByText('Available to stake')
					.locator('xpath=//following-sibling::*[2]')
			).toContainText(regExp);
		}

		if (usdcYield?.maxRate) {
			const regExp = new RegExp(`Up to.*${usdcYield.maxRate}%`);
			await expect(
				this.sumrBlockLocator.getByText('USDC Yield').locator('xpath=//following-sibling::*[1]')
			).toContainText(regExp);
		}

		if (usdcYield?.maxUsdPerYear) {
			const regExp = new RegExp(`\\$.*${usdcYield.maxUsdPerYear}.*/ year`);
			await expect(
				this.sumrBlockLocator.getByText('USDC Yield').locator('xpath=//following-sibling::*[2]')
			).toContainText(regExp);
		}
	}

	@step
	async openSumrRewardsTab() {
		await this.sumrBlockLocator.click();
	}
}
