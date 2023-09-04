import { expect, Page } from '@playwright/test';
import { Vaults } from './vaults';
import { portfolioTimeout } from 'utils/config';

export class Earn {
	readonly page: Page;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.vaults = new Vaults(page);
	}

	async shouldHaveHeaderCount(count: string) {
		await expect(this.page.getByText('Summer.fi Earn')).toContainText(count, {
			timeout: portfolioTimeout,
		});
	}
}
