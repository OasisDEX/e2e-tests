import { Page } from '@playwright/test';
import { VaultSidebar } from '../vaultSidebar';

export class PositionPage {
	readonly page: Page;

	readonly sideBar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.sideBar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
	}
}
