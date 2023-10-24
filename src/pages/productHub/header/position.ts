import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class Position {
	readonly positionLocator: Locator;

	constructor(headerLocator: Locator) {
		this.positionLocator = headerLocator.locator('h1 > div').nth(0);
	}

	@step
	async shouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await expect(
			this.positionLocator.locator('span').nth(0),
			`Position Category should be: ${positionCategory}`
		).toContainText(positionCategory, {
			timeout: 15_000,
		});
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.positionLocator.click();
		await this.positionLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
