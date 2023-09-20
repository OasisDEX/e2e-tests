import { expect, Locator } from '@playwright/test';

export class Pool {
	readonly poolLocator: Locator;

	constructor(poolLocator: Locator) {
		this.poolLocator = poolLocator;
	}

	async open() {
		await this.poolLocator.click();
	}

	async shouldBevisible() {
		await expect(this.poolLocator.locator('td:nth-child(1)')).toBeVisible();
	}

	async shouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await expect(this.poolLocator.locator('span').nth(0)).toContainText(positionCategory);
	}

	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.poolLocator.click();
		await this.poolLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
