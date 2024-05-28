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

	@step
	async getPool() {
		const pool = await this.poolLocator.locator('td').first().innerText();
		return pool;
	}

	@step
	async getStrategy() {
		const strategy = await this.poolLocator.locator('td').nth(1).innerText();
		return strategy;
	}

	@step
	async getAPY() {
		const apyText = await this.poolLocator.locator('td').nth(3).innerText();
		const apy = parseFloat(apyText.replace('%', ''));
		return apy;
	}

	@step
	async getProtocol() {
		const pool = await this.poolLocator
			.locator('td')
			.last()
			.locator('img')
			.first()
			.getAttribute('alt');
		return pool;
	}

	@step
	async getNetwork() {
		const pool = await this.poolLocator
			.locator('td')
			.last()
			.locator('img')
			.last()
			.getAttribute('alt');
		return pool;
	}
}
