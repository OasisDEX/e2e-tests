import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class InstitutionOverview {
	readonly page: Page;

	readonly panelLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.panelLocator = page.locator('[class*="PanelInstitutionOverview"]');
	}

	vaultLocator(name: string): Locator {
		return this.page.locator(`[class*="_yourVaultsWrapper_"] tbody tr:has-text("${name}")`);
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

	@step
	async shouldHaveVaults(
		vaults: {
			name: string;
			value?: string;
			thirtyDayAPY?: string;
		}[]
	) {
		for (const vault of vaults) {
			if (vault.value) {
				const regExp = new RegExp(`\\$${vault.value}`);
				await expect(
					this.vaultLocator(vault.name).getByRole('cell').nth(1),
					`Should have $${vault.value} value`
				).toContainText(regExp);
			}

			if (vault.thirtyDayAPY) {
				const regExp = new RegExp(`${vault.thirtyDayAPY}${vault.thirtyDayAPY === '-' ? '' : '%'}`);
				await expect(
					this.vaultLocator(vault.name).getByRole('cell').nth(2),
					`Should have ${vault.thirtyDayAPY}${vault.thirtyDayAPY === '-' ? '' : '%'} 30d APY`
				).toContainText(regExp);
			}
		}
	}

	@step
	async viewVault(vaultname: string) {
		await this.vaultLocator(vaultname).locator('a:has-text("View")').click();
	}
}
