import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Rewards {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('What are $SUMR?'),
			'"What are $SUMR?" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('Boost your $SUMR', { exact: true }),
			'"Boost your $SUMR" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('More about Rewards & $SUMR', { exact: true }),
			'"More about Rewards & $SUMR" should be visible'
		).toBeVisible();
	}
}
