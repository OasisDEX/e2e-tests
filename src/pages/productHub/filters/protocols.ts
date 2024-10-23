import { step } from '#noWalletFixtures';
import { Locator } from '@playwright/test';

export class Protocols {
	readonly productHubLocator: Locator;

	readonly protocolsLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
		this.protocolsLocator = this.productHubLocator
			.getByText('Clear selection')
			.nth(2)
			.locator('..')
			.locator('..')
			.locator('..');
	}

	@step
	async select({
		protocols,
	}: {
		protocols: (
			| ('Clear selecrtion' | 'Maker' | 'Aave V2' | 'Aave V3' | 'Ajna' | 'Spark')
			| ('Aave V3' | 'Maker' | 'Morpho' | 'Spark')
		)[];
	}) {
		const currentLabel = await this.protocolsLocator.locator('span').first().innerText();

		// First clear selection if any protocols had been previously selected
		if (currentLabel !== 'All protocols') {
			await this.protocolsLocator.locator('div').first().click();
			await this.protocolsLocator
				.getByRole('listitem')
				.filter({ hasText: 'Clear selection' })
				.click();
		}

		await this.protocolsLocator.locator('div').first().click();
		for (const protocol of protocols) {
			await this.protocolsLocator.getByRole('listitem').filter({ hasText: protocol }).click();
		}
		await this.protocolsLocator.locator('div').first().click();
	}
}
