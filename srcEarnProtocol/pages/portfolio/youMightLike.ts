import { Locator, Page } from '@playwright/test';
import { StrategyCard } from '../strategyCard';
import { step } from '#earnProtocolFixtures';

export class YouMightLike {
	readonly page: Page;

	readonly youMightLikeLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.youMightLikeLocator = page.locator('section:has-text("You might like")');
	}

	nthCard(nth: number) {
		return new StrategyCard(
			this.page,
			this.youMightLikeLocator.locator('[class*="_strategyCard_"]').nth(nth)
		);
	}

	@step
	async move(direction: 'Left' | 'Right') {
		await this.youMightLikeLocator
			.getByRole('button')
			.nth(direction === 'Left' ? 0 : 1)
			.click();
	}
}