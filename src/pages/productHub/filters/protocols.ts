import { step } from '#noWalletFixtures';
import { Locator } from '@playwright/test';

export class Protocols {
	readonly productHubLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
	}

	@step
	async select({
		protocols,
		positionType,
	}: {
		protocols: (
			| ('Clear selection' | 'Aave V2' | 'Aave V3' | 'Ajna' | 'Maker' | 'Morpho' | 'Sky' | 'Spark')
			| ('Aave V3' | 'Maker' | 'Morpho' | 'Spark')
		)[];
		positionType?: 'Earn';
	}) {
		const protocolsLocator = this.productHubLocator
			.getByText('Clear selection')
			.nth(positionType ? 1 : 2)
			.locator('..')
			.locator('..')
			.locator('..');

		const currentLabel = await protocolsLocator.locator('span').first().innerText();

		// First clear selection if any protocols had been previously selected
		if (currentLabel !== 'All protocols') {
			await protocolsLocator.locator('div').first().click();
			await protocolsLocator.getByRole('listitem').filter({ hasText: 'Clear selection' }).click();
		}

		await protocolsLocator.locator('div').first().click();
		for (const protocol of protocols) {
			await protocolsLocator.getByRole('listitem').filter({ hasText: protocol }).click();
		}
		await protocolsLocator.locator('div').first().click();
	}
}
