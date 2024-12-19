import { expect, Page } from '@playwright/test';
import { VaultExposure } from './vaultExposure';
import { VaultSidebar } from '../vaultSidebar';
import { step } from '#noWalletFixtures';
import { EarnTokens } from 'srcEarnProtocol/utils/types';

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
	async shouldHaveEarned({
		token,
		totalAmount,
		earnedAmount,
	}: {
		token: EarnTokens;
		totalAmount: string;
		earnedAmount: string;
	}) {
		const totalRegExp = new RegExp(`${totalAmount}.*${token}`);
		const earnedRegExp = new RegExp(`${earnedAmount}.*${token}`);
		const earnedBlockLocator = this.page.locator(
			'[class*="_dataBlockWrapper_"]:has-text("Earned")'
		);

		await expect(earnedBlockLocator.locator('span').first()).toContainText(totalRegExp);
		await expect(earnedBlockLocator.locator('span').last()).toContainText(earnedRegExp);
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
	async shouldHave30dApy({
		thirtyDayApy,
		currentApy,
	}: {
		thirtyDayApy: string;
		currentApy: string;
	}) {
		const thirtyDayRegExp = new RegExp(`${thirtyDayApy}%`);
		const currentRegExp = new RegExp(`Current APY: ${currentApy}%`);
		// # of Deposits:
		const netContributionLocator = this.page.locator(
			'[class*="_dataBlockWrapper_"]:has-text("30d APY")'
		);

		await expect(netContributionLocator.locator('span').first()).toContainText(thirtyDayRegExp);
		await expect(netContributionLocator.locator('span').last()).toContainText(currentRegExp);
	}
}
