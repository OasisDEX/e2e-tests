import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class BuildYourOwnVault {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Summer.fi enables institutions to build their own custom vaults'),
			'"Summer.fi enables..." subheader shouldbe visible',
		).toBeVisible();
	}
}
