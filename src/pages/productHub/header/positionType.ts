import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class PositionType {
	readonly positionTypeLocator: Locator;

	constructor(headerLocator: Locator) {
		this.positionTypeLocator = headerLocator.locator('h1 > div').nth(0);
	}

	@step
	async shouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await expect(
			this.positionTypeLocator.locator('span').nth(0),
			`Position Category should be: ${positionCategory}`
		).toContainText(positionCategory, {
			timeout: 15_000,
		});
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.positionTypeLocator.click();
		await this.positionTypeLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
