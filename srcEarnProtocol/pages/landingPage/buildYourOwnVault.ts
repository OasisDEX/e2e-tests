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
			this.page.getByText(
				'Self managed vaults by Summer.fi Institutional enable institutions to build their own custom vault',
			),
			'"Self managed vaults by..." subheader shouldbe visible',
		).toBeVisible();
	}
}
