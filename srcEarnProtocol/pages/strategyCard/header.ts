import { step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page, cardLocator: Locator) {
		this.page = page;
		this.headerLocator = cardLocator.locator('[class*="_strategyCardHeaderWrapper"]');
	}

	@step
	async getToken(): Promise<string> {
		const token = await this.headerLocator.getByTestId('strategy-token').innerText();
		return token;
	}

	@step
	async getNetwork(): Promise<string> {
		const network = await this.headerLocator
			.getByTestId('strategy-network')
			.locator('img')
			.getAttribute('alt');
		return network.replace('network_', '');
	}

	@step
	async getRisk(): Promise<string> {
		const risk = await this.headerLocator.getByText(' risk').innerText();
		return risk;
	}
}
