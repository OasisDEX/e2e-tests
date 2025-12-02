import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Staking {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Stake your SUMR and earn real USD yield'),
			'"Stake your SUMR and ..." header should be visible'
		).toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}
}
