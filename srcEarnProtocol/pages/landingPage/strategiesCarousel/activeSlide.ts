import { Page } from '@playwright/test';
import { StrategyCard } from '../../strategyCard';
import { StrategySidebar } from '../../strategySidebar';

export class ActiveSlide {
	readonly page: Page;

	readonly strategyCard: StrategyCard;

	readonly strategySidebar: StrategySidebar;

	constructor(page: Page) {
		this.page = page;
		this.strategyCard = new StrategyCard(
			page,
			page.locator('[class*="_slideActive_"]').locator('[class*="_strategyCard_"]')
		);
		this.strategySidebar = new StrategySidebar(
			page,
			page.locator('[class*="_slideActive_"]').locator('[class*="_sidebarWrapper_"]')
		);
	}
}
