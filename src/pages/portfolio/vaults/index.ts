import { Locator } from '@playwright/test';
import { Vault } from './vault';

export class Vaults {
	readonly listLocator: Locator;

	readonly vault: Vault;

	readonly vaultsLocator: Locator;

	constructor(vaultsLocator: Locator) {
		this.listLocator = vaultsLocator.locator('tbody tr');
	}

	get first() {
		return this.nthVault(0);
	}

	nthVault(nth: number) {
		return new Vault(this.listLocator.nth(nth));
	}
}
