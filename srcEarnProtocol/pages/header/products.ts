import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

type ProductsPages =
	| 'Permissionless DeFi Vaults'
	// | 'Permissioned RWA Vault'
	| 'Build your own Vault'
	| 'Integrate the Lazy Summer Protocol';

export class Products {
	readonly page: Page;

	readonly productsLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.productsLocator = headerLocator.getByRole('listitem').filter({ hasText: 'Products' });
	}

	@step
	async open() {
		await this.productsLocator.hover();
		// Pause to avoid random fails
		await this.page.waitForTimeout(500);
	}

	@step
	async shouldList(menuOptions: ProductsPages[]) {
		for (const menuOption in menuOptions) {
			await expect(
				this.productsLocator.getByText(menuOptions[menuOption], { exact: true }),
			).toBeVisible();
		}
	}

	@step
	async select(page: ProductsPages) {
		await this.productsLocator
			.getByRole('link')
			.filter({ has: this.page.getByText(page, { exact: true }) })
			.click();
	}
}
