import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Calculator } from './calculator';
import { Claimed } from './claimed';
import { Header } from './header';
import { Leaderboard } from './leaderboard';
import { OpenPosition } from './openPosition';

export class Rays {
	readonly page: Page;

	readonly calculator: Calculator;

	readonly claimed: Claimed;

	readonly header: Header;

	readonly leaderboard: Leaderboard;

	readonly openPosition: OpenPosition;

	constructor(page: Page) {
		this.page = page;
		this.calculator = new Calculator(page);
		this.claimed = new Claimed(page);
		this.header = new Header(page);
		this.leaderboard = new Leaderboard(page);
		this.openPosition = new OpenPosition(page);
	}

	@step
	async shouldBeVivible() {
		await expect(this.page.getByText('Claim your $RAYS')).toBeVisible();
	}

	@step
	async openPage(wallet?: string) {
		await expect(async () => {
			await this.page.goto(`/rays${wallet ? `?userAddress=${wallet}` : ''}`);
			if (wallet) {
				await expect(this.page.getByText('is eligible for up to')).toBeVisible();
			} else {
				await this.shouldBeVivible();
			}
		}).toPass();
	}

	@step
	async shouldLinkToRaysBlogInNewTab() {
		const href = await this.page
			.getByRole('link', { name: 'Read about Rays' })
			.getAttribute('href');
		const target = await this.page
			.getByRole('link', { name: 'Read about Rays' })
			.getAttribute('target');
		expect(href).toBe('https://blog.summer.fi/introducing-rays-points-program');
		expect(target).toBe('_blank');
	}

	@step
	async connectWallet() {
		await this.page.getByRole('button', { name: 'Connect wallet', exact: true }).click();
	}

	@step
	async openCalculator() {
		await expect(async () => {
			await this.page.getByText('Use $RAYS Calculator').click();
			await expect(this.page.getByRole('button', { name: 'Calculate $RAYS' })).toBeVisible();
		}).toPass();
	}

	@step
	async shouldShowRaysDetailedInfo(walletAddress: string) {
		await expect(this.page.locator('h1[class*="ClaimRaysTitle_connectedTitl"]')).toContainText(
			`Wallet ${walletAddress.toLowerCase().substring(0, 4)}...${walletAddress.slice(
				-5
			)} is eligible for up to `
		);

		const regExp = new RegExp('\\+.*earning (\\d,)?\\d.\\d.*\\$RAYS.*a.*year');
		await expect(this.page.locator('h3[class*="ClaimRaysTitle_earning"]')).toContainText(regExp);
	}

	@step
	async claimRays() {
		await this.page.getByRole('button', { name: 'Claim $RAYS' }).click();
	}

	@step
	async getRaysPerYear() {
		const raysText = await this.page.locator('h3[class*="ClaimRaysTitle_earning"]').innerText();
		const raysNumber = parseFloat(raysText.slice(10, -13).replace(',', ''));

		return raysNumber;
	}
}
