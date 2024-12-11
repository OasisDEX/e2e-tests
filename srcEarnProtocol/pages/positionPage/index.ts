import { Page } from '@playwright/test';
import { VaultExposure } from './vaultExposure';
import { VaultSidebar } from '../vaultSidebar';

export class PositionPage {
	readonly page: Page;

	readonly exposure: VaultExposure;

	readonly sideBar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.exposure = new VaultExposure(page);
		this.sideBar = new VaultSidebar(page, this.page.locator('[class*="_sidebarWrapper_"]'));
	}
}
