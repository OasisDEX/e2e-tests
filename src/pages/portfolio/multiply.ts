import { expect, Page } from '@playwright/test';
import { Vaults } from './vaults';
import { portfolioTimeout } from 'utils/config';

export class Multiply {
	readonly page: Page;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.vaults = new Vaults(page.locator('h3:has-text("Summer.fi Multiply") + div'));
	}

	async shouldHaveHeaderCount(count: string) {
		await expect(this.page.getByText('Summer.fi Multiply')).toContainText(count, {
			timeout: portfolioTimeout,
		});
	}
}
