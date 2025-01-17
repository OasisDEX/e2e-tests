import { step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class Support {
	readonly page: Page;

	readonly supportLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.supportLocator = headerLocator.getByRole('listitem').filter({ hasText: 'Support' });
	}

	@step
	async open() {
		await this.supportLocator.hover();
	}
}
