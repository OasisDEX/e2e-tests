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
			await expect(
				this.page.getByText('Earned:').first(),
				'"Earned:" should be visible'
			).toBeVisible({
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();
	}

	@step
	async shouldHaveMarketValue({ token, amount }: { token: EarnTokens; amount: string }) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span').first()
		).toContainText(regExp);
	}

	@step
	async shouldHaveEarned({ token, amount }: { token: EarnTokens; amount: string }) {
		const regExp = new RegExp(`${amount}.*${token}`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Market Value") span').last()
		).toContainText(regExp);
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
	async shouldHaveLiveApy(apy: string) {
		const regExp = new RegExp(`${apy}%`);

		await expect(
			this.page.locator('[class*="_dataBlockWrapper_"]:has-text("Live APY") span').first()
		).toContainText(regExp);
	}
}
