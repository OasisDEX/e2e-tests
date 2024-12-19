import { Locator, Page } from '@playwright/test';
import { Header } from './header';
import { expect, step } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class VaultCard {
	readonly page: Page;

	readonly header: Header;

	readonly cardLocator: Locator;

	constructor(page: Page, cardLocator: Locator) {
		this.page = page;
		this.cardLocator = cardLocator;
		this.header = new Header(page, cardLocator);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.cardLocator).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async select() {
		await this.cardLocator.click();
	}

	@step
	async shouldBeSelected() {
		await expect(this.cardLocator.locator('..')).toHaveClass(/_selected_/);
	}
}
