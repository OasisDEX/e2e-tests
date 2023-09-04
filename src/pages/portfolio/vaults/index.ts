import { Locator, Page } from '@playwright/test';
import { Vault } from './vault';

export class Vaults {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly vault: Vault;

	readonly vaultsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultsLocator = page.locator('h3:has-text("Summer.fi Earn") + div');
		this.listLocator = this.vaultsLocator.locator('tbody tr');
	}

	get first() {
		return this.nthVault(0);
	}

	nthVault(nth: number) {
		return new Vault(this.listLocator.nth(nth));
	}
}
