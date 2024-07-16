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
}
