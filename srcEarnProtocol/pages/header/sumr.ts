import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Sumr {
	readonly page: Page;

	readonly sumrLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.sumrLocator = headerLocator.getByRole('listitem').filter({ hasText: '$SUMR' });
	}

	@step
	async shouldBeVisible() {
		await expect(this.sumrLocator).toBeVisible();
	}

	@step
	async open() {
		await this.sumrLocator.hover();
	}

	@step
	async select(option: 'Learn about $SUMR' | 'Stake $SUMR' | 'Governance') {
		await this.sumrLocator.locator(`a:has-text("${option}")`).click();
	}
}
