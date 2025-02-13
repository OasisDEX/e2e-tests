import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { PositionsHub } from './positionsHub';
import { Wallet } from './wallet';
import { expectDefaultTimeout, portfolioTimeout } from 'utils/config';

export type PortfolioData = {
	[index: string]: number | { id: string; pool: string; type: string }[];
	reasons: number;
	totalValue: number;
	portfolioValue: number;
	totalSupplied: number;
	totalBorrowed: number;
	emptyPositionsCount: number;
	positionsListedCount: number;
	positionsListedData: {
		id: string;
		pool: string;
		type: string;
	}[];
};

export class Portfolio {
	readonly page: Page;

	readonly positionsHub: PositionsHub;

	readonly wallet: Wallet;

	constructor(page: Page) {
		this.page = page;
		this.positionsHub = new PositionsHub(page);
		this.wallet = new Wallet(page);
	}

	@step
	async open(wallet?: string, args?: { withPositions?: boolean }) {
		if (args?.withPositions) {
			await expect(async () => {
				await this.page.goto(`/portfolio/${wallet}`);

				const errorLoadingPositions = this.page.getByText(
					'There was an error trying to load positions'
				);
				const firstPosition = this.page
					.getByRole('link')
					.filter({ hasText: 'View Position' })
					.locator('span:has-text("$")')
					.nth(0);

				let errorLoadingPositionsIsVisible: boolean | undefined;
				let firstPositionIsVisible: boolean | undefined;

				await expect(async () => {
					errorLoadingPositionsIsVisible = await errorLoadingPositions.isVisible();
					firstPositionIsVisible = await firstPosition.isVisible();

					expect(errorLoadingPositionsIsVisible || firstPositionIsVisible).toBeTruthy();
				}).toPass();

				if (errorLoadingPositionsIsVisible)
					throw new Error('Go back to loop (expect.toPass) starting point');

				// await expect(
				// 	this.page
				// 		.getByRole('link')
				// 		.filter({ hasText: 'View Position' })
				// 		.locator('span:has-text("$")')
				// 		.nth(0),
				// 	`First position's Net Value should be visible`
				// ).toBeVisible({
				// 	timeout: expectDefaultTimeout * 4,
				// });
			}).toPass();
		} else {
			await this.page.goto(`/portfolio/${wallet ?? ''}`);
		}
	}

	@step
	async openOnProduction(wallet?: string) {
		await this.page.goto(`https://pro.summer.fi/portfolio/${wallet ?? ''}`);
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
		return parseFloat(value.replace(',', '').replace('$', '').replace('M', ''));
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
		return parseFloat(value.replace(',', '').replace('$', '').replace('M', ''));
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
		return parseFloat(value.replace(',', '').replace('$', '').replace('M', ''));
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
		return parseFloat(value.replace(',', '').replace('$', '').replace('M', ''));
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
		return parseFloat(value.replace(',', '').replace('$', '').replace('M', ''));
	}

	@step
	async shouldHavePositionsPanelWithoutErrors() {
		const noPositions = this.page.getByText('There are no positions');
		const positionsListed = this.page.getByRole('button', { name: 'View Position', exact: true });
		const migratePositions = this.page.getByText('Why migrate?');
		const errorLoadingPositions = this.page.getByText('error trying to load positions');

		let errorLoadingPositionsCount: number = 0;

		// Initial check to make sure that positions component has either loaded or shown error
		await expect(async () => {
			const noPositionsCount = await noPositions.count();
			const positionsListedCount = await positionsListed.count();
			const migratePositionsCount = await migratePositions.count();
			errorLoadingPositionsCount = await errorLoadingPositions.count();

			expect(
				noPositionsCount + positionsListedCount + migratePositionsCount + errorLoadingPositionsCount
			).toBeGreaterThan(0);
		}).toPass();

		// Check that positions component loaded without errors
		expect(errorLoadingPositionsCount).toEqual(0);
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
		let data: PortfolioData = {
			reasons: 0,
			totalValue: 0,
			portfolioValue: 0,
			totalSupplied: 0,
			totalBorrowed: 0,
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
			await this.positionsHub.getNumberOfPositions();
		data.emptyPositionsCount = emptyPositionsCount;
		data.positionsListedCount = positionsListedCount;
		data.positionsListedData = await this.positionsHub.getPositionsData();

		return data;
	}
}
