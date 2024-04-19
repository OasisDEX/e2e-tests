import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class Position {
	readonly positionLocator: Locator;

	constructor(headerLocator: Locator) {
		this.positionLocator = headerLocator.locator('h1 > div').nth(0);
	}

	@step
	async shouldBe(positionCategory: 'borrow' | 'earn' | 'multiply') {
		const introText = {
			borrow: 'Easily borrow stablecoins or other crypto-assets against your collateral',
			earn: 'Earn long term yields to compound your crypto capital',
			multiply:
				'Multiply allows you to simply and securely increase your exposure to any crypto asset',
		};
		await expect(
			this.positionLocator.getByText(introText[positionCategory]),
			`'introText[positionCategory]' should be visible`
		).toBeVisible();
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.positionLocator.click();
		await this.positionLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
