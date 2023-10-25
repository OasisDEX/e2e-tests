import { expect, Page } from '@playwright/test';
import { Vaults } from './vaults';
import { portfolioTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

export class Multiply {
	readonly page: Page;

	readonly vaults: Vaults;

	constructor(page: Page) {
		this.page = page;
		this.vaults = new Vaults(page, page.locator('h3:has-text("Summer.fi Multiply") + div'));
	}

	@step
	async shouldHaveHeaderCount(count: string) {
		await expect(this.page.getByRole('heading', { name: 'Summer.fi Multiply' })).toContainText(
			count,
			{
				timeout: portfolioTimeout,
			}
		);
	}
}
