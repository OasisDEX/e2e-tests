import { expect, Locator } from '@playwright/test';

export class Pool {
	readonly positionLocator: Locator;

	constructor(headerLocator: Locator) {
		this.positionLocator = headerLocator.locator('h1 > div').nth(0);
	}

	async shouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await expect(this.positionLocator.locator('span').nth(0)).toContainText(positionCategory);
	}

	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.positionLocator.click();
		await this.positionLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
