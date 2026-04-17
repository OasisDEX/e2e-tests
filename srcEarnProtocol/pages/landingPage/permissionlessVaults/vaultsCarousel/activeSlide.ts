import { step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

type Device = 'Desktop' | 'Mobile';

export class ActiveSlide {
	readonly page: Page;

	readonly activeSlideLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.activeSlideLocator = page.locator('[class*="vaultCardHomepageContentWrapperSelected"]');
	}

	@step
	async getToken(): Promise<string> {
		const token = await this.activeSlideLocator.getByTestId('vault-token').innerText();
		return token;
	}

	@step
	async getNetwork(): Promise<string> {
		const network =
			(await this.activeSlideLocator
				.getByTestId('vault-network')
				.locator('svg')
				.getAttribute('title')) ?? '';
		return network.split('network_')[1];
	}

	@step
	async getRisk({ device }: { device: Device }): Promise<string> {
		const risk = await this.activeSlideLocator
			.locator(`[class*="dataBlock${device}"]`)
			.getByText(' risk')
			.nth(1) // Otherwise detecting also 'Risk' element
			.innerText();
		return risk;
	}

	@step
	async getDetails({ device }: { device: Device }) {
		const token = await this.getToken();
		const network = await this.getNetwork();
		const risk = await this.getRisk({ device });

		return { token, network, risk };
	}
}
