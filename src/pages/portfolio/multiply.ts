import { expect, Page } from '@playwright/test';
import { Positions } from './positions';
import { portfolioTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

export class Multiply {
	readonly page: Page;

	readonly positions: Positions;

	constructor(page: Page) {
		this.page = page;
		this.positions = new Positions(page, page.locator('h3:has-text("Summer.fi Multiply") + div'));
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
