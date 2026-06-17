import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';
import { VaultSidebar } from '../vaultSidebar';

export class PositionPage {
	readonly page: Page;

	readonly earnedTooltipLocator: Locator;

	readonly marketValueDataBlockLocator: Locator;

	readonly marketValueTooltipBtnLocator: Locator;

	readonly marketValueTooltipLocator: Locator;

	readonly refreshButtonLocator: Locator;

	readonly sidebar: VaultSidebar;

	readonly wstethRewardsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.earnedTooltipLocator = this.page.locator('[data-tooltip-id]:has-text("Earned")');
		this.marketValueDataBlockLocator = this.page.locator(
			'[class*="_dataBlockWrapper_"]:has-text("Market Value") span',
		);
		this.marketValueTooltipBtnLocator = this.page.locator(
			'[class*="_dataBlockWrapper_"]:has-text("Market Value") [data-tooltip-btn-id]',
		);
		this.marketValueTooltipLocator = this.page.locator(
			'[data-tooltip-id]:has-text("Market Value")',
		);
		this.refreshButtonLocator = this.page.locator('svg[title="refresh"]');
		this.sidebar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
		this.wstethRewardsLocator = this.page.getByText('WSTETH Rewards', { exact: true });
	}

	@step
	async open(url: string) {
		await expect(async () => {
			await this.page.goto(url, { timeout: expectDefaultTimeout * 4 });

			if (url.includes('arbitrum') || url.includes('sonic') || url.includes('hyperliquid')) {
				await this.shouldHaveNumberOfDeposits();
			} else {
				// Reload position data to avoid random fails
				await expect(this.refreshButtonLocator).toBeVisible({
					timeout: expectDefaultTimeout * 2,
				});
				await this.page.waitForTimeout(1_000);
				await this.refreshButtonLocator.click();

				await this.shouldHaveLiveApy('[0-9].[0-9]{2}', { timeout: expectDefaultTimeout * 3 });
			}
		}).toPass();
	}

	@step
	async shouldHaveMarketValue({
		token,
		amount,
		usdAmount,
	}: {
		token: EarnTokens;
		amount: string;
		usdAmount: string;
	}) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(
			this.marketValueDataBlockLocator.first(),
			`Market Value should contain ${regExp}`,
		).toContainText(regExp);

		// Verify tooltip
		await this.marketValueTooltipBtnLocator.first().hover();
		await expect(
			this.marketValueTooltipLocator,
			'Market Value tooltip should be visible',
		).toHaveClass(/tooltipOpen/);

		const tootltipRegExp = new RegExp(`USD.*Market.*Value:.*\\$${usdAmount}`);
		await expect(
			this.marketValueTooltipLocator,
			`Market Value tooltip should contain ${tootltipRegExp}`,
		).toContainText(tootltipRegExp);
	}

	@step
	async shouldHaveEarned({
		token,
		amount,
		usdAmount,
	}: {
		token: EarnTokens;
		amount: string;
		usdAmount: string;
	}) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(this.marketValueDataBlockLocator.last()).toContainText(regExp);

		// Verify that is greater than 0
		const earnedAmountText = await this.marketValueDataBlockLocator.last().innerText();
		const earnedAmount = parseFloat(
			earnedAmountText.replace('Earned:', '').replace('<', '').replace(token, ''),
		);
		expect(earnedAmount).toBeGreaterThan(0);

		// Verify tooltip
		await this.marketValueTooltipBtnLocator.nth(1).hover();
		await expect(this.earnedTooltipLocator, 'Earned tooltip should be visible').toHaveClass(
			/tooltipOpen/,
		);

		const tootltipRegExp = new RegExp(`USD.*Earned:.*\\$${usdAmount}`);
		await expect(
			this.earnedTooltipLocator,
			`Earned tooltip should contain ${tootltipRegExp}`,
		).toContainText(tootltipRegExp);

		// Verify that tooltip is greater than 0
		const earnedTooltipAmountText = await this.earnedTooltipLocator.innerText();

		const earnedTooltipAmount = parseFloat(
			earnedTooltipAmountText.replace('USD Earned: $', '').replace('<', '').replace(token, ''),
		);
		expect(earnedTooltipAmount).toBeGreaterThan(0);
	}

	@step
	async shouldHaveNetContribution({
		token,
		amount,
		numberOfDeposits,
	}: {
		token: EarnTokens;
		amount: string;
		numberOfDeposits: string;
	}) {
		const usdRegExp = new RegExp(`${amount}.*${token}`);
		const depositsRegExp = new RegExp(`# of Deposits: ${numberOfDeposits}`);

		const netContributionLocator = this.page.locator(
			'[class*="_dataBlockWrapper_"]:has-text("Net Contribution")',
		);

		await expect(netContributionLocator.locator('span').first()).toContainText(usdRegExp);
		await expect(netContributionLocator.locator('span').last()).toContainText(depositsRegExp);
	}

	@step
	async shouldHaveNumberOfDeposits() {
		const countText = await this.page.getByText('# of Deposits:').innerText();
		const netCount = parseFloat(countText.replace('# of Deposits: ', ''));

		expect(netCount, `# of Deposits should be greater than 0`).toBeGreaterThan(0);
	}

	@step
	async shouldHaveLiveApy(apy: string, args?: { timeout: number }) {
		const regExp = new RegExp(`${apy}%`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"] span:has-text("Live Native APY")').first(),
		).toContainText(regExp, { timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldHaveWstethRewards(args?: { wstethAmount?: string; usdAmount?: string }) {
		await expect(this.wstethRewardsLocator).toBeVisible();

		if (args?.wstethAmount) {
			const regExp = new RegExp(`${args.wstethAmount}.*WSTETH`);
			await expect(
				this.wstethRewardsLocator.locator('xpath=//following-sibling::*[1]'),
			).toContainText(regExp);
		}

		if (args?.usdAmount) {
			const regExp = new RegExp(`\\$${args.usdAmount}`);
			await expect(
				this.wstethRewardsLocator.locator('xpath=//following-sibling::*[1]'),
			).toContainText(regExp);
		}
	}

	@step
	async shouldNotHaveWstethRewards() {
		await expect(
			this.wstethRewardsLocator,
			'"WSTETH Rewards" block should not be visible',
		).not.toBeVisible();
	}
}
