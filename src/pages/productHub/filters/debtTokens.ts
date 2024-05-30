import { step } from '#noWalletFixtures';
import { Locator } from '@playwright/test';
import { Tokens } from 'utils/testData';

export class DebtTokens {
	readonly productHubLocator: Locator;

	readonly debtTokensLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
		this.debtTokensLocator = this.productHubLocator
			.getByText('Clear selectionStablecoins')
			.locator('..')
			.locator('..');
	}

	@step
	async select(token: Tokens) {
		const currentLabel = await this.debtTokensLocator.locator('span').first().innerText();

		// First clear selection if any tokens had been previously selected
		if (currentLabel !== 'All debt tokens') {
			await this.debtTokensLocator.locator('div').first().click();
			await this.debtTokensLocator
				.getByRole('listitem')
				.filter({ hasText: 'Clear selection' })
				.click();
		}

		await this.debtTokensLocator.locator('div').first().click();
		const regExp = new RegExp(`^${token}$`);
		await this.debtTokensLocator.getByRole('listitem').filter({ hasText: regExp }).click();
		await this.debtTokensLocator.locator('div').first().click();
	}
}
