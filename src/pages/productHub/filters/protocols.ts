import { Locator } from '@playwright/test';

export class Protocols {
	readonly productHubLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
	}

	async select({
		currentFilter,
		protocols,
	}: {
		currentFilter:
			| 'All protocols'
			| 'Clear selection'
			| 'Maker'
			| 'Aave V2'
			| 'Aave V3'
			| 'Ajna'
			| 'Spark';
		protocols: ('Clear selecrtion' | 'Maker' | 'Aave V2' | 'Aave V3' | 'Ajna' | 'Spark')[];
	}) {
		await this.productHubLocator.getByText(currentFilter).locator('..').click();

		for (const protocol of protocols) {
			await this.productHubLocator.getByRole('listitem').filter({ hasText: protocol }).click();
		}

		if (protocols.length === 1) {
			await this.productHubLocator.getByText(protocols[0]).nth(0).locator('..').click();
		} else {
			await this.productHubLocator.getByText('Selected protocols').nth(0).locator('..').click();
		}
	}
}
