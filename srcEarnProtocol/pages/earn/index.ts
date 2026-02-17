import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { AssetsSelector } from './assetSelector';
import { NetworkSelector } from './networkSelector';
import { Vaults } from './vaults';
import { VaultSidebar } from '../vaultSidebar';
import { LazyNominatedTokens, Networks, Risks } from 'srcEarnProtocol/utils/types';

export class Earn {
	readonly page: Page;

	readonly assetsSelector: AssetsSelector;

	readonly networkSelector: NetworkSelector;

	readonly sidebar: VaultSidebar;

	readonly sumrBlockLocator: Locator;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.assetsSelector = new AssetsSelector(page);
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
			'"Earn" header should be visible',
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout * 2 });
	}

	@step
	async toggleInWalletVaults() {
		const toggleLocator = this.page
			.getByText('In wallet', { exact: true })
			.locator('xpath=//following-sibling::*[1]');

		await expect(toggleLocator).toBeVisible({ timeout: expectDefaultTimeout * 3 });
		await toggleLocator.click();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveVaults(vaults: { token: LazyNominatedTokens; network: Networks; risk: Risks }[]) {
		for (const vault of vaults) {
			await this.vaults
				.byStrategy({ token: vault.token, network: vault.network, risk: vault.risk })
				.shouldBeVisible();
		}
	}

	@step
	async shouldNotHaveVaults(
		vaults: { token: LazyNominatedTokens; network: Networks; risk: Risks }[],
	) {
		for (const vault of vaults) {
			await this.vaults
				.byStrategy({ token: vault.token, network: vault.network, risk: vault.risk })
				.shouldNotBeVisible();
		}
	}

	@step
	async sumrBlockShouldHave({
		sumrRewardApy,
		availableToStake,
		usdcYield,
		timeout,
	}: {
		sumrRewardApy?: string;
		availableToStake?: { sumrAmount?: string; usdAmount?: string };
		usdcYield?: { maxRate?: string; maxUsdPerYear?: string };
		timeout?: number;
	}) {
		if (sumrRewardApy) {
			const regExp = new RegExp(`${sumrRewardApy}%`);
			await expect(this.sumrBlockLocator.getByText('SUMR Reward APY up to').first()).toContainText(
				regExp,
				{ timeout: timeout ?? expectDefaultTimeout },
			);
		}

		if (availableToStake?.sumrAmount) {
			const regExp = new RegExp(`${availableToStake.sumrAmount}.*SUMR`);
			await expect(
				this.sumrBlockLocator
					.getByText('Available to stake')
					.locator('xpath=//following-sibling::*[1]'),
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (availableToStake?.usdAmount) {
			const regExp = new RegExp(`\\$.*${availableToStake.usdAmount}`);
			await expect(
				this.sumrBlockLocator
					.getByText('Available to stake')
					.locator('xpath=//following-sibling::*[2]'),
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (usdcYield?.maxRate) {
			const regExp = new RegExp(`Up to.*${usdcYield.maxRate}%`);
			await expect(
				this.sumrBlockLocator.getByText('USDC Yield').locator('xpath=//following-sibling::*[1]'),
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (usdcYield?.maxUsdPerYear) {
			const regExp = new RegExp(`\\$.*${usdcYield.maxUsdPerYear}.*/ Year`);
			await expect(
				this.sumrBlockLocator.getByText('USDC Yield').locator('xpath=//following-sibling::*[2]'),
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}
	}

	@step
	async openSumrRewardsTab() {
		await this.sumrBlockLocator.click();
	}
}
