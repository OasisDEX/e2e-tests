import { Locator } from '@playwright/test';

export class Networks {
	readonly productHubLocator: Locator;

	constructor(productHubLocator: Locator) {
		this.productHubLocator = productHubLocator;
	}

	async select({
		currentFilter,
		networks,
	}: {
		currentFilter:
			| 'All networks'
			| 'Clear selection'
			| 'Ethereum'
			| 'Arbitrum'
			| 'Optimism'
			| 'Base';
		networks: ('Clear selecrtion' | 'Ethereum' | 'Arbitrum' | 'Optimism' | ' Base')[];
	}) {
		await this.productHubLocator.getByText(currentFilter).locator('..').click();

		for (const protocol of networks) {
			await this.productHubLocator.getByRole('listitem').filter({ hasText: protocol }).click();
		}

		if (networks.length === 1) {
			await this.productHubLocator.getByText(networks[0]).nth(0).locator('..').click();
		} else {
			await this.productHubLocator.getByText('Selected networks').nth(0).locator('..').click();
		}
	}
}
