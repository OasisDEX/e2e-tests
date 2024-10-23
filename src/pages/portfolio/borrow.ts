import { expect, Page } from '@playwright/test';
import { Positions } from './positions';
import { portfolioTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

export class Borrow {
	readonly page: Page;

	readonly positions: Positions;

	constructor(page: Page) {
		this.page = page;
		this.positions = new Positions(page, page.locator('h3:has-text("Summer.fi Borrow") + div'));
	}

	@step
	async shouldHaveHeaderCount(count: string) {
		await expect(this.page.getByText('Summer.fi Borrow')).toContainText(count, {
			timeout: portfolioTimeout,
		});
	}
}
