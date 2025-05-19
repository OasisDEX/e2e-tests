import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class Migrate {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Why Migrate?' }),
			'"Why Migrate?" headershould be visible'
		).toBeVisible();
	}

	@step
	async selectPositionToMigrateByListOrder(nth: number) {
		await this.page
			.locator('#migration-positions-list [class*="cardPrimary"]')
			.nth(nth - 1)
			.click();
	}

	@step
	async selectVaulToMigrateToByNetworkAndListOrder({
		network,
		nth,
	}: {
		network: 'arbitrum';
		nth: number;
	}) {
		await this.page
			.locator('[class*="MigrationLandingPageView_vaultsList"] [class*="cardPrimary"]')
			.filter({ has: this.page.getByTestId('vault-network').locator(`svg[title*="${network}"]`) })
			.nth(nth - 1)
			.click();
	}

	@step
	async migrate() {
		await this.page.getByRole('button', { name: 'Migrate' }).click();
	}
}
