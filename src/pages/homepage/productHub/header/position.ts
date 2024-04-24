import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class PositionType {
	readonly headerLocator: Locator;

	constructor(headerLocator: Locator) {
		this.headerLocator = headerLocator;
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
			this.headerLocator.getByText(introText[positionCategory]),
			`'${introText[positionCategory]}' should be visible`
		).toBeVisible();
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.headerLocator.click();
		await this.headerLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
