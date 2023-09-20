import { Locator, Page } from '@playwright/test';
import { Vault } from './vault';

export class Vaults {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly vault: Vault;

	readonly vaultsLocator: Locator;

	constructor(page: Page, vaultsLocator: Locator) {
		this.page = page;
		this.vaultsLocator = vaultsLocator;
		this.listLocator = vaultsLocator.locator('tbody tr');
	}

	get first() {
		return this.nthVault(0);
	}

	nthVault(nth: number) {
		return new Vault(this.listLocator.nth(nth));
	}

	byId(id: string) {
		return new Vault(
			this.listLocator.filter({ has: this.page.getByText(`Position #${id}`, { exact: true }) })
		);
	}
}
