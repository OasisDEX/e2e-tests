import { Page } from '@playwright/test';
import { ClaimAndDelegate } from './claimAndDelegate';
import { expect, step } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class Rewards {
	readonly page: Page;

	readonly claimAndDelegate: ClaimAndDelegate;

	constructor(page: Page) {
		this.page = page;
		this.claimAndDelegate = new ClaimAndDelegate(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Your Total $SUMR'),
			'"Your Total $SUMR" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('Total $SUMR available to claim', { exact: true }),
			'"$SUMR available to claim" should be visible'
		).toBeVisible();
	}

	@step
	async claim(args?: { env: 'production' }) {
		await this.page
			.getByRole('button', {
				name: args?.env ? 'Claim' : 'Claim $SUMR',
				exact: true,
			})
			.click();
	}
}
