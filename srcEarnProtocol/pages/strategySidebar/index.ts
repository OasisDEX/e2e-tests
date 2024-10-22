import { Locator, Page } from '@playwright/test';

export class StrategySidebar {
	readonly page: Page;

	readonly sideBarLocator: Locator;

	constructor(page: Page, sideBarLocator: Locator) {
		this.page = page;
		this.sideBarLocator = sideBarLocator;
	}
}
