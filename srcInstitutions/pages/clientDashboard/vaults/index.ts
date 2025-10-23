import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { Activity } from './activity';
import { AssetRelocation } from './assetRelocation';
import { ClientAdmin } from './clientAdmin';
import { FeeAndRevenueAdmin } from './feeAndRevenueAdmin';
import { Overview } from './overview';
import { RiskParameters } from './riskParameters';
import { RoleAdmin } from './roleAdmin';
import { VaultExposure } from './vaultExposure';
import { EarnTokens } from 'srcEarnProtocol/utils/types';

type Panels =
	| 'Overview'
	| 'Vault exposure'
	| 'Asset relocation'
	| 'Risk Parameters'
	| 'Role admin'
	| 'Client admin'
	| 'Fee & revenue admin'
	| 'Activity';

export class Vaults {
	readonly page: Page;

	readonly panelLocator: Locator;

	readonly activity: Activity;

	readonly assetRelocation: AssetRelocation;

	readonly clientAdmin: ClientAdmin;

	readonly feeAndRevenueAdmin: FeeAndRevenueAdmin;

	readonly overview: Overview;

	readonly riskParameters: RiskParameters;

	readonly roleAdmin: RoleAdmin;

	readonly vaultExposure: VaultExposure;

	constructor(page: Page) {
		this.page = page;
		this.panelLocator = page.locator('[class*="dashboardContentLayout"]');
		this.activity = new Activity(page);
		this.assetRelocation = new AssetRelocation(page);
		this.clientAdmin = new ClientAdmin(page);
		this.feeAndRevenueAdmin = new FeeAndRevenueAdmin(page);
		this.overview = new Overview(page);
		this.riskParameters = new RiskParameters(page);
		this.roleAdmin = new RoleAdmin(page);
		this.vaultExposure = new VaultExposure(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.panelLocator.locator('[class*="VaultsDropdownWrapper_contentWrapper_"]').first(),
			'Vaults dropdown should be visible'
		).toBeVisible();

		await expect(
			this.panelLocator.getByRole('button', { name: 'Vault exposure' }),
			'"Vault exposure" panel should be visible'
		).toBeVisible();
	}

	@step
	async shouldHavePanelActive(panel: Panels) {
		await expect(
			this.panelLocator.getByRole('button', { name: panel }).locator('div').first()
		).toHaveClass(/_activeButtonText_/);
	}

	@step
	async selectPanel(panel: Panels) {
		await this.panelLocator.getByRole('button', { name: panel }).click();
	}

	@step
	async shouldHaveVaultHeader({
		name,
		asset,
		nav,
		aum,
		fee,
		inception,
	}: {
		name?: string;
		asset?: EarnTokens;
		nav?: string;
		aum?: string;
		fee?: string;
		inception?: string;
	}) {
		const fieldLocator = (fieldName: 'Name' | 'Asset' | 'NAV' | 'AUM' | 'Fee' | 'Inception') =>
			this.page
				.locator('[class*="DashboardVaultHeader_dataBlockWrapper_"]')
				.filter({ hasText: fieldName });

		if (name) {
			await expect(fieldLocator('Name'), `Should have Name: ${name}`).toContainText(name);
		}

		if (asset) {
			await expect(fieldLocator('Asset'), `Should have Asset: ${asset}`).toContainText(asset);
		}

		if (nav) {
			const regExp = new RegExp(nav);
			await expect(fieldLocator('NAV'), `Should have NAV: ${nav}`).toContainText(regExp);
		}

		if (aum) {
			const regExp = new RegExp(aum);
			await expect(fieldLocator('AUM'), `Should have AUM: ${aum}`).toContainText(regExp);
		}

		if (fee) {
			const regExp = new RegExp(`${fee}%`);
			await expect(fieldLocator('Fee'), `Should have Fee: ${fee}%`).toContainText(regExp);
		}

		if (inception) {
			await expect(fieldLocator('Inception'), `Should have Inception: ${inception}`).toContainText(
				inception
			);
		}
	}
}
