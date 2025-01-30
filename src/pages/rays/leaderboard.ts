import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Leaderboard {
	readonly page: Page;

	readonly leaderboardLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.leaderboardLocator = this.page
			.locator('div[class*="LeaderboardSearchBoxAndResults"]')
			.locator('..');
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/rays/leaderboard');
			await this.shouldHaveNextPage();
		}).toPass();
	}

	@step
	async shouldHaveResults(count: number) {
		await expect(async () => {
			const actualCount: number = await this.leaderboardLocator
				.locator('tbody > tr')
				.filter({ hasNotText: 'How do I move up the leaderboard?' })
				.count();
			expect(actualCount).toBe(count);
		}).toPass({ timeout: expectDefaultTimeout });
	}

	@step
	async viewFullLeaderboard() {
		await this.leaderboardLocator.getByText('View Full Leaderboard').click();
	}

	@step
	async shouldHaveNextPage() {
		await expect(this.leaderboardLocator.getByText('next page')).toBeVisible();
	}

	@step
	async shouldNotHaveNextPage() {
		await expect(this.leaderboardLocator.getByText('next page')).not.toBeVisible();
	}

	@step
	async search(address: string) {
		await this.leaderboardLocator
			.locator('input[placeholder="Search wallet address or ENS"]')
			.type(address);
	}

	@step
	async shouldDisplaySearchedAddressInTopRow(shortenedAddress: string) {
		await expect(this.leaderboardLocator.getByText("You're here")).toBeVisible();
		const topRowText = await this.leaderboardLocator.locator('tbody > tr').first().innerText();
		expect(topRowText).toContain(shortenedAddress.toLowerCase());
	}

	@step
	async shouldLinkToRaysBlogInNewTab() {
		const buttons = ['Enable Automations', 'Open a position', 'Use Swap'];

		for (const button of buttons) {
			const href = await this.page.getByRole('link', { name: button }).getAttribute('href');
			const target = await this.page.getByRole('link', { name: button }).getAttribute('target');
			expect(href).toBe('https://blog.summer.fi/introducing-rays-points-program');
			expect(target).toBe('_blank');
		}
	}

	@step
	async viewRaysDetailedInfo({ leaderboardResult }: { leaderboardResult: number }) {
		const walletAddress = await this.leaderboardLocator
			.locator('p[class*="Leaderboard_userColumn"]')
			.nth(leaderboardResult - 1)
			.innerText();

		await this.leaderboardLocator
			.locator('p[class*="Leaderboard_userColumn"] a')
			.nth(leaderboardResult - 1)
			.click();

		return walletAddress;
	}
}
