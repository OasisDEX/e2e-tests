import { Page } from '@playwright/test';
import { Borrow } from './borrow';
import { Earn } from './earn';
import { Multiply } from './multiply';
import { TopAssetsAndPositions } from './topAssetsAndPositions';

export class Portfolio {
	readonly page: Page;

	readonly borrow: Borrow;

	readonly earn: Earn;

	readonly multiply: Multiply;

	readonly topAssetsAndPositions: TopAssetsAndPositions;

	constructor(page: Page) {
		this.page = page;
		this.borrow = new Borrow(page);
		this.earn = new Earn(page);
		this.multiply = new Multiply(page);
		this.topAssetsAndPositions = new TopAssetsAndPositions(page);
	}

	async open(wallet?: string) {
		await this.page.goto(`/owner/${wallet ?? ''}`);
	}
}
