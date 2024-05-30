import { step } from '#noWalletFixtures';
import { Locator } from '@playwright/test';
import { Tokens } from 'utils/testData';

export class CollateralTokens {
	readonly productHubLocator: Locator;

	readonly collateralTokensLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
		this.collateralTokensLocator = this.productHubLocator
			.getByText('Clear selectionETH variants')
			.locator('..')
			.locator('..');
	}

	@step
	async select(token: Tokens) {
		const currentLabel = await this.collateralTokensLocator.locator('span').first().innerText();

		// First clear selection if any tokens had been previously selected
		if (currentLabel !== 'All collateral tokens') {
			await this.collateralTokensLocator.locator('div').first().click();
			await this.collateralTokensLocator
				.getByRole('listitem')
				.filter({ hasText: 'Clear selection' })
				.click();
		}

		await this.collateralTokensLocator.locator('div').first().click();
		const regExp = new RegExp(`^${token}$`);
		await this.collateralTokensLocator.getByRole('listitem').filter({ hasText: regExp }).click();
		await this.collateralTokensLocator.locator('div').first().click();
	}
}
