import { Page } from '@playwright/test';
import { StrategyCard } from 'srcEarnProtocol/pages/strategyCard';

export class ActiveSlide {
	readonly page: Page;

	readonly strategyCard: StrategyCard;

	constructor(page: Page) {
		this.page = page;
		this.strategyCard = new StrategyCard(
			page,
			page.locator('[class*="_slideActive_"]').locator('[class*="_strategyCard_"]')
		);
	}
}
