import { expect, Page } from '@playwright/test';
import { VaultSidebar } from '../vaultSidebar';
import { step } from '#noWalletFixtures';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class PositionPage {
	readonly page: Page;

	readonly sidebar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.sidebar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
	}

	@step
	async open(url: string) {
		await expect(async () => {
			await this.page.goto(url);

			// Reload position data to avoid random fails
			await expect(this.page.locator('svg[title="refresh"]')).toBeVisible();
			await this.page.locator('svg[title="refresh"]').click();

			await this.shouldHaveLiveApy('[0-9].[0-9]{2}');
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
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span').first(),
			`Market Value should contain ${regExp}`
		).toContainText(regExp);

		// Verify tooltip
		await this.page
			.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") [data-tooltip-btn-id]')
			.first()
			.hover();
		await expect(
			this.page.locator('[data-tooltip-id]:has-text("Market")'),
			'Market Value tooltip should be visible'
		).toHaveClass(/tooltipOpen/);

		const tootltipRegExp = new RegExp(`USD.*Market.*Value:.*\\$${usdAmount}`);
		await expect(
			this.page.locator('[data-tooltip-id]:has-text("Market")'),
			`Market Value tooltip should contain ${tootltipRegExp}`
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

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span').last()
		).toContainText(regExp);

		// Verify that it's greater than 0
		const earnedAmountText = await this.page
			.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span')
			.last()
			.innerText();
		const earnedAmount = parseFloat(earnedAmountText.replace('Earned:', '').replace('USDC', ''));
		expect(earnedAmount).toBeGreaterThan(0);

		// Verify tooltip
		await this.page
			.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") [data-tooltip-btn-id]')
			.nth(1)
			.hover();
		await expect(
			this.page.locator('[data-tooltip-id]:has-text("Earned:")'),
			'Earned tooltip should be visible'
		).toHaveClass(/tooltipOpen/);

		const tootltipRegExp = new RegExp(`USD.*Earned:.*\\$${usdAmount}`);
		await expect(
			this.page.locator('[data-tooltip-id]:has-text("Earned:")'),
			`Earned tooltip should contain ${tootltipRegExp}`
		).toContainText(tootltipRegExp);

		// Verify that tooltip it's greater than 0
		const earnedTooltipAmountText = await this.page
			.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span')
			.last()
			.innerText();
		const earnedTooltipAmount = parseFloat(
			earnedTooltipAmountText.replace('Earned:', '').replace('USDC', '')
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
			'[class*="_dataBlockWrapper_"]:has-text("Net Contribution")'
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
	@step
	async shouldHaveLiveApy(apy: string, args?: { timeout: number }) {
		const regExp = new RegExp(`${apy}%`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Live APY") span').first()
		).toContainText(regExp, { timeout: args?.timeout ?? expectDefaultTimeout });
	}
}
