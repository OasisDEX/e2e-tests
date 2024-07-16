import { expect, Locator, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Calculator } from './calculator';
import { Header } from './header';
import { Leaderboard } from './leaderboard';

export class Rays {
	readonly page: Page;

	readonly calculator: Calculator;

	readonly header: Header;

	readonly leaderboard: Leaderboard;

	readonly leaderboardLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.calculator = new Calculator(page);
		this.header = new Header(page);
		this.leaderboard = new Leaderboard(page);
	}

	@step
	async shouldBeVivible() {
		await expect(this.page.getByText('Claim your $RAYS')).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/rays');
			await this.shouldBeVivible();
		}).toPass();
	}

	@step
	async connectWallet() {
		await this.page.getByText('Connect wallet').click();
	}

	@step
	async openCalculator() {
		await expect(async () => {
			await this.page.getByText('Use $RAYS Calculator').click();
			await expect(this.page.getByRole('button', { name: 'Calculate $RAYS' })).toBeVisible();
		}).toPass();
	}
}
