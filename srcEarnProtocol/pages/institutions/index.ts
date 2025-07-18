import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { PublicAccessVaults } from './publicAccessVaults';
import { SelfManagedVaults } from './selfManagedVaults';

export class Institutions {
	readonly page: Page;

	readonly publicAccessVaults: PublicAccessVaults;

	readonly selfManagedVaults: SelfManagedVaults;

	constructor(page: Page) {
		this.page = page;
		this.publicAccessVaults = new PublicAccessVaults(page);
		this.selfManagedVaults = new SelfManagedVaults(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Crypto native yield, built for' }),
			'"Crypto native yield..." header should be visible'
		).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/institutions');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async open(page: 'Self managed Vaults' | 'Public Access Vaults') {
		await this.page
			.locator(`[class*="institutionsPromoBlockWrapper_"]:has-text("${page}")`)
			.getByRole('button', { name: 'Learn more' })
			.click();
	}
}
