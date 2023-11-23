import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Positions } from './positions';
import { Wallet } from './wallet';

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
	async open(wallet?: string) {
		await this.page.goto(`/portfolio/${wallet ?? ''}`);
	}

	@step
	async shouldHaveViewingWalletBanner({
		shortenedAddress,
		description,
	}: {
		shortenedAddress: string;
		description: string;
	}) {
		await expect(
			this.page.getByText(`You are viewing the wallet of ${shortenedAddress}`, { exact: true }),
			`"You are viewing the wallet of ${shortenedAddress}" should be visible`
		).toBeVisible();
		await expect(
			this.page.getByText(description, { exact: true }),
			`"${description}" should be visible`
		).toBeVisible();
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
	async shouldHaveWalletAddress(address: string) {
		await expect(
			this.page.getByText(address, { exact: true }),
			`"${address}" should be visible`
		).toBeVisible();
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
	async shouldHaveSummerfiPortfolio(value: string) {
		await expect(
			this.page.locator('span:has-text("Summer.fi Portfolio")').locator('..')
		).toContainText(value);
	}

	@step
	async shouldHaveTotalSupplied(value: string) {
		await expect(this.page.locator('span:has-text("Total Supplied")').locator('..')).toContainText(
			value
		);
	}

	@step
	async shouldHaveTotalBorrowed(value: string) {
		await expect(this.page.locator('span:has-text("Total Borrowed")').locator('..')).toContainText(
			value
		);
	}
}
