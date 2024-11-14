import { step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page, cardLocator: Locator) {
		this.page = page;
		this.headerLocator = cardLocator.locator('[class*="_vaultCardHeaderWrapper"]');
	}

	@step
	async getToken(): Promise<string> {
		const token = await this.headerLocator.getByTestId('vault-token').innerText();
		return token;
	}

	@step
	async getNetwork(): Promise<string> {
		const network =
			(await this.headerLocator
				.getByTestId('vault-network')
				.locator('svg')
				.getAttribute('title')) ?? '';
		return network.replace('network_', '');
	}

	@step
	async getRisk(): Promise<string> {
		const risk = await this.headerLocator.getByText(' risk').innerText();
		return risk;
	}

	@step
	async getDetails() {
		const token = await this.getToken();
		const network = await this.getNetwork();
		const risk = await this.getRisk();

		return { token, network, risk };
	}
}
