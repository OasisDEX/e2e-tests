import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Header } from './header';

export class Rays {
	readonly page: Page;

	readonly header: Header;

	constructor(page: Page) {
		this.page = page;
		this.header = new Header(page);
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
}
