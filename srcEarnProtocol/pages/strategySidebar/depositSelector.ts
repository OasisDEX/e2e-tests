import { step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class DepositSelector {
	readonly page: Page;

	readonly depositLocator: Locator;

	constructor(page: Page, sidebarLocator: Locator) {
		this.page = page;
		this.depositLocator = sidebarLocator.locator('[class*="_dropdown_"]');
	}

	@step
	async open() {
		await this.depositLocator.locator('[class*="_dropdownSelected_"]').click();
	}
}
