import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class InstitutionOverview {
	readonly page: Page;

	readonly panelLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.panelLocator = page.locator('[class*="PanelInstitutionOverview"]');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.panelLocator.locator('[class*="AumChart"] svg').first(),
			'AUM chart should be visible'
		).toBeVisible();

		await expect(
			this.panelLocator.getByText('Your Vaults', { exact: true }),
			'"Your Vaults" section should be visible'
		).toBeVisible();
	}
}
