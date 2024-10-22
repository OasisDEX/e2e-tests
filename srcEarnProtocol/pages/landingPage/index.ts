import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { StrategiesCarousel } from './strategiesCarousel';

export class LandingPage {
	readonly page: Page;

	readonly strategiesCarousel: StrategiesCarousel;

	constructor(page: Page) {
		this.page = page;
		this.strategiesCarousel = new StrategiesCarousel(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Automated Exposure to DeFi'),
			'"Automated Exposure..." should be visible'
		).toBeVisible();
	}

	@step
	async open() {
		await expect(async () => {
			await this.page.goto('https://earn-protocol-landing-page-staging.oasisapp.dev/');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldShowStrategyCard() {
		await expect(
			this.page.locator('[class*="_strategyCardHeaderWrapper"]').nth(0),
			'Strategy card should be visible'
		).toBeVisible();
	}
}
