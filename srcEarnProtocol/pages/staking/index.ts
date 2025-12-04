import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { Manage } from './manage';

export class Staking {
	readonly page: Page;

	readonly manage: Manage;

	constructor(page: Page) {
		this.page = page;
		this.manage = new Manage(page);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Stake your SUMR and earn real USDC yield'),
			'"Stake your SUMR and ..." header should be visible'
		).toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/staking');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveSumrInWallet({
		sumrAmount,
		usdAmount,
		timeout,
	}: {
		sumrAmount: string;
		usdAmount: string;
		timeout?: number;
	}) {
		const elementLocator = this.page
			.getByText('SUMR in your wallet and available to stake')
			.locator('..');

		const sumrRegExp = new RegExp(`${sumrAmount}.*SUMR`);
		await expect(elementLocator).toContainText(sumrRegExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});

		const usdRegExp = new RegExp(`\\$${usdAmount}`);
		await expect(elementLocator).toContainText(usdRegExp);
	}

	@step
	async stakeYourSumr() {
		await this.page.getByRole('button', { name: 'Stake your SUMR' }).click();
	}

	@step
	async shouldHaveSumrToClaim({
		sumrAmount,
		usdAmount,
		timeout,
	}: {
		sumrAmount: string;
		usdAmount: string;
		timeout?: number;
	}) {
		const elementLocator = this.page.getByText('SUMR available to claim').locator('..');

		const sumrRegExp = new RegExp(`${sumrAmount}.*SUMR`);
		await expect(elementLocator).toContainText(sumrRegExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});

		const usdRegExp = new RegExp(`\\$${usdAmount}`);
		await expect(elementLocator).toContainText(usdRegExp);
	}

	@step
	async claimYourSumr() {
		await this.page.getByRole('button', { name: 'Claim your SUMR' }).click();
	}

	@step
	async shouldHaveYieldSource1({
		percentage,
		perYear,
		timeout,
	}: {
		percentage: string;
		perYear: string;
		timeout?: number;
	}) {
		const yieldOneLocator = this.page
			.locator('[class*="_cardDataBlock_"]')
			.filter({ has: this.page.locator('[class*="_yieldSourceLabel_"]') })
			.first();

		const regExp = new RegExp(
			`USDC real yield.*up to.*${percentage}%.*Up to \\$${perYear} \\/Year`
		);
		await expect(yieldOneLocator).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldHaveYieldSource2({
		percentage,
		sumrPerYear,
		usdPerYear,
		timeout,
	}: {
		percentage: string;
		sumrPerYear: string;
		usdPerYear: string;
		timeout?: number;
	}) {
		const yieldTwoLocator = this.page
			.locator('[class*="_cardDataBlock_"]')
			.filter({ has: this.page.locator('[class*="_yieldSourceLabel_"]') })
			.last();

		const regExp = new RegExp(
			`SUMR Staking APY.*up to.*${percentage}%.*Up to ${sumrPerYear} \\$SUMR\\/Year \\(\\$${usdPerYear}\\)`
		);
		await expect(yieldTwoLocator).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldHaveAnnualizedRevenue({
		usdAmount,
		sumrTvl,
		timeout,
	}: {
		usdAmount: string;
		sumrTvl: string;
		timeout?: number;
	}) {
		const elementLocator = this.page
			.locator('[class*="_cardDataBlock_"]')
			.filter({ has: this.page.getByText('Lazy Summer Annualized Revenue') });

		const regExp = new RegExp(`\\$${usdAmount}.*${sumrTvl}.*Lazy Summer TVL`);
		await expect(elementLocator).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldHaveSharePaidToStakers({
		usdAmount,
		timeout,
	}: {
		usdAmount: string;
		timeout?: number;
	}) {
		const elementLocator = this.page
			.locator('[class*="_cardDataBlock_"]')
			.filter({ has: this.page.getByText('Revenue share paid to Stakers') });

		const regExp = new RegExp(`20%.*\\$${usdAmount}.*a year`);
		await expect(elementLocator).toContainText(regExp, {
			timeout: timeout ?? expectDefaultTimeout,
		});
	}
}
