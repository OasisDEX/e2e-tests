import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';

export class PositionType {
	readonly headerLocator: Locator;

	constructor(headerLocator: Locator) {
		this.headerLocator = headerLocator;
	}

	@step
	async shouldBe(positionCategory: 'Borrow' | 'Earn' | 'Multiply') {
		const introText = {
			borrow: 'Easily borrow stablecoins or other crypto-assets against your collateral',
			earn: 'Earn long term yields to compound your crypto capital',
			multiply:
				'Multiply allows you to simply and securely increase your exposure to any crypto asset',
		};

		const categoryText = introText[positionCategory.toLowerCase()];

		await expect(
			this.headerLocator.getByText(categoryText),
			`'${categoryText}' should be visible`
		).toBeVisible();
	}

	@step
	async select(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		await this.headerLocator.locator(`li:has-text("${positionCategory}")`).click();
	}
}
