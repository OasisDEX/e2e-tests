import { Page } from '@playwright/test';
import { Borrow } from './borrow';
import { Earn } from './earn';
import { Multiply } from './multiply';
import { TopAssetsAndPositions } from './topAssetsAndPositions';
import { Vaults } from './vaults';

export class Portfolio {
	readonly page: Page;

	readonly borrow: Borrow;

	readonly earn: Earn;

	readonly multiply: Multiply;

	readonly topAssetsAndPositions: TopAssetsAndPositions;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.borrow = new Borrow(page);
		this.earn = new Earn(page);
		this.multiply = new Multiply(page);
		this.topAssetsAndPositions = new TopAssetsAndPositions(page);
		this.vaults = new Vaults(page, page.locator('h3:has-text("Summer.fi") + div'));
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
	}
}
