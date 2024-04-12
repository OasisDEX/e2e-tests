import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Positions } from './positions';
import { Wallet } from './wallet';
import { expectDefaultTimeout, portfolioTimeout } from 'utils/config';

export class Portfolio {
	readonly page: Page;

	readonly positions: Positions;

	readonly wallet: Wallet;

	constructor(page: Page) {
		this.page = page;
		this.positions = new Positions(page);
		this.wallet = new Wallet(page);
	}

	@step
	async open(wallet?: string, args?: { withPositions?: boolean }) {
		if (args?.withPositions) {
			await expect(async () => {
				await this.page.goto(`/portfolio/${wallet}`);
				await expect(
					this.page
						.getByRole('link')
						.filter({ hasText: 'Position #' })
						.locator('span:has-text("$")')
						.nth(0),
					`First position's Net Value should be visible`
				).toBeVisible({
					timeout: 10_000,
				});
			}).toPass();
		} else {
			await this.page.goto(`/portfolio/${wallet ?? ''}`);
		}
	}

	@step
	async openOnProduction(wallet?: string) {
		await this.page.goto(`https://summer.fi/portfolio/${wallet ?? ''}`);
	}

	@step
	async shouldHaveViewingWalletBanner(shortenedAddress: string) {
		await expect(
			this.page.getByText(`You are viewing the wallet of ${shortenedAddress}`, { exact: true }),
			`"You are viewing the wallet of ${shortenedAddress}" should be visible`
		).toBeVisible();
	}

	@step
	async getReasonsValue() {
		const value = await this.page.getByText('worth of reasons to open').locator('span').innerText();
		return value;
	}

	@step
	async connectWallet() {
		await this.page
			.getByText('Connect your wallet to see what positions you could open')
			.locator('../..')
			.getByRole('button', { name: 'Connect a wallet' })
			.click();
	}

	@step
	async shouldHaveWalletAddress(
		{ address, timeout }: { address: string; timeout?: number } = {
			address: '',
			timeout: expectDefaultTimeout,
		}
	) {
		await expect(
			this.page.getByText(address, { exact: true }),
			`"${address}" should be visible`
		).toBeVisible({ timeout });
	}

	@step
	async shouldLinktoEtherscan(address: string) {
		await expect(this.page.getByRole('link', { name: 'View on Etherscan' })).toHaveAttribute(
			'href',
			`https://etherscan.io/address/${address}`
		);
	}

	@step
	async shouldHaveTotalValue(value: string) {
		await expect(this.page.locator('span:has-text("Total Value")').locator('..')).toContainText(
			value,
			{ timeout: 10_000 }
		);
	}

	@step
	async getTotalValue() {
		const value = await this.page.locator('span:has-text("Total Value") + h2').innerText();
		return value;
	}

	@step
	async shouldHaveSummerfiPortfolio(value: string) {
		await expect(
			this.page.locator('span:has-text("Summer.fi Portfolio")').locator('..')
		).toContainText(value);
	}

	@step
	async getPortfolioValue() {
		const value = await this.page.locator('span:has-text("Summer.fi Portfolio") + h2').innerText();
		return value;
	}

	@step
	async shouldHaveTotalSupplied(value: string) {
		await expect(this.page.locator('span:has-text("Total Supplied")').locator('..')).toContainText(
			value
		);
	}

	@step
	async getTotalSupplied() {
		const value = await this.page.locator('span:has-text("Total Supplied") + h2').innerText();
		return value;
	}

	@step
	async shouldHaveTotalBorrowed(value: string) {
		await expect(this.page.locator('span:has-text("Total Borrowed")').locator('..')).toContainText(
			value
		);
	}

	@step
	async getTotalBorrowed() {
		const value = await this.page.locator('span:has-text("Total Borrowed") + h2').innerText();
		return value;
	}

	@step
	async shouldHavePositionsPanelWithoutErrors() {
		const noPositions = this.page.getByText('There are no positions');
		const positionsListed = this.page.getByRole('link').filter({ hasText: 'Position #' });
		const migratePositions = this.page.getByText('Why migrate?');
		const errorLoadingPositions = this.page.getByText('error trying to load positions');

		await expect(async () => {
			const noPositionsCount = await noPositions.count();
			const positionsListedCount = await positionsListed.count();
			const migratePositionsCount = await migratePositions.count();
			const errorLoadingPositionsCount = await errorLoadingPositions.count();

			expect(
				noPositionsCount + positionsListedCount + migratePositionsCount + errorLoadingPositionsCount
			).toBeGreaterThan(0);
			expect(errorLoadingPositionsCount).toEqual(0);
		}).toPass();
	}

	@step
	async loadPortfolioPageAndPositions({
		environment,
		walletAddress,
	}: {
		environment: 'staging' | 'production';
		walletAddress: string;
	}) {
		await expect(async () => {
			if (environment === 'staging') {
				await this.open(walletAddress);
			} else {
				await this.openOnProduction(walletAddress);
			}
			await this.shouldHavePositionsPanelWithoutErrors();
		}).toPass({ timeout: portfolioTimeout * 2 });
	}

	@step
	async getPortfolioData() {
		let data: {
			reasons: string;
			totalValue: string;
			portfolioValue: string;
			totalSupplied: string;
			totalBorrowed: string;
			emptyPositionsCount: number;
			positionsListedCount: number;
			positionsListedData: {
				id: string;
				pool: string;
				type: string;
			}[];
		} = {
			reasons: '',
			totalValue: '',
			portfolioValue: '',
			totalSupplied: '',
			totalBorrowed: '',
			emptyPositionsCount: 0,
			positionsListedCount: 0,
			positionsListedData: [],
		};

		data.reasons = await this.getReasonsValue();
		data.totalValue = await this.getTotalValue();
		data.portfolioValue = await this.getPortfolioValue();
		data.totalSupplied = await this.getTotalSupplied();
		data.totalBorrowed = await this.getTotalBorrowed();

		const { emptyPositionsCount, positionsListedCount } =
			await this.positions.getNumberOfPositions();
		data.emptyPositionsCount = emptyPositionsCount;
		data.positionsListedCount = positionsListedCount;
		data.positionsListedData = await this.positions.getPositionsData();

		return data;
	}
}
