import { Locator, Page } from '@playwright/test';
import { Header } from './header';

export class StrategyCard {
	readonly page: Page;

	readonly header: Header;

	readonly cardLocator: Locator;

	constructor(page: Page, cardLocator: Locator) {
		this.page = page;
		this.header = new Header(page, cardLocator);
	}
}
