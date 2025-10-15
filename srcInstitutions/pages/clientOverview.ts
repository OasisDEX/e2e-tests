import { expect, step } from '#institutionsFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class ClientOverview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'TestClient Corporation' })).toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}
}
