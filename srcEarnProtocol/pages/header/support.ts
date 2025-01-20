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

	@step
	async select(option: 'Sign up' | 'Contact us' | 'Start chatting') {
		await this.supportLocator.locator(`a:has-text("${option}")`).click();
	}
}
