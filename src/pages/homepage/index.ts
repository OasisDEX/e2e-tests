import { expect, Page } from '@playwright/test';
import { ProductHub } from './productHub';
import { step } from '#noWalletFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class Homepage {
	readonly page: Page;

	readonly productHub: ProductHub;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('The best place to Borrow and Earn in DeFi'),
			'"The best place to Borrow and Earn in DeFi" should be visible'
		).toBeVisible({
			timeout: expectDefaultTimeout * 4,
		});
	}

	@step
	async open() {
		await expect(async () => {
			await this.page.goto('');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async connectWallet() {
		await this.page.getByText('Connect a wallet').click();
	}

	@step
	async openRaysPage() {
		await this.page.getByRole('link').filter({ hasText: 'Learn how to earn $RAYS' }).click();
	}
}
