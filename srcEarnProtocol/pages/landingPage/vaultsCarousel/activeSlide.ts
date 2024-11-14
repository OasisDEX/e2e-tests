import { Page } from '@playwright/test';
import { VaultCard } from 'srcEarnProtocol/pages/vaultCard';
import { VaultSidebar } from 'srcEarnProtocol/pages/vaultSidebar';

export class ActiveSlide {
	readonly page: Page;

	readonly vaultCard: VaultCard;

	readonly vaultSidebar: VaultSidebar;

	constructor(page: Page) {
		this.page = page;
		this.vaultCard = new VaultCard(
			page,
			page.locator('[class*="_slideActive_"]').locator('[class*="_vaultCard_"]')
		);
		this.vaultSidebar = new VaultSidebar(
			page,
			page.locator('[class*="_slideActive_"]').locator('[class*="_sidebarWrapper_"]')
		);
	}
}
