import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class Pool {
	readonly poolLocator: Locator;

	constructor(poolLocator: Locator) {
		this.poolLocator = poolLocator;
	}

	@step
	async open() {
		await this.poolLocator.click();
	}

	@step
	async shouldBevisible() {
		await expect(this.poolLocator.locator('td:nth-child(1)')).toBeVisible();
	}

	@step
	async shouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await expect(this.poolLocator.locator('span').nth(0)).toContainText(positionCategory);
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.poolLocator.click();
		await this.poolLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
