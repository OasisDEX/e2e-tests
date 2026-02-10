import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';
import { Activity } from './activity';
import { AssetManagement } from './assetManagement';
import { AssetRelocation } from './assetRelocation';
import { ClientAdmin } from './clientAdmin';
import { FeeAndRevenueAdmin } from './feeAndRevenueAdmin';
import { Overview } from './overview';
import { RiskParameters } from './riskParameters';
import { RoleAdmin } from './roleAdmin';
import { UserAdmin } from './userAdmin';
import { VaultExposure } from './vaultExposure';

type Panels =
	| 'Overview'
	| 'Vault exposure'
	| 'Risk Parameters'
	| 'Fee & revenue admin'
	| 'Asset reallocation'
	| 'Asset management'
	| 'Role admin'
	| 'User admin'
	| 'Activity';

export class Vaults {
	readonly page: Page;

	readonly panelLocator: Locator;

	readonly activity: Activity;

	readonly assetManagement: AssetManagement;

	readonly assetRelocation: AssetRelocation;

	readonly clientAdmin: ClientAdmin;

	readonly feeAndRevenueAdmin: FeeAndRevenueAdmin;

	readonly overview: Overview;

	readonly riskParameters: RiskParameters;

	readonly roleAdmin: RoleAdmin;

	readonly userAdmin: UserAdmin;

	readonly vaultExposure: VaultExposure;

	constructor(page: Page) {
		this.page = page;
		this.panelLocator = page.locator('[class*="dashboardContentLayout"]');
		this.activity = new Activity(page);
		this.assetManagement = new AssetManagement(page);
		this.assetRelocation = new AssetRelocation(page);
		this.clientAdmin = new ClientAdmin(page);
		this.feeAndRevenueAdmin = new FeeAndRevenueAdmin(page);
		this.overview = new Overview(page);
		this.riskParameters = new RiskParameters(page);
		this.roleAdmin = new RoleAdmin(page);
		this.userAdmin = new UserAdmin(page);
		this.vaultExposure = new VaultExposure(page);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.panelLocator.locator('[class*="VaultsDropdownWrapper_contentWrapper_"]').first(),
			'Vaults dropdown should be visible',
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });

		await expect(
			this.panelLocator.getByRole('button', { name: 'Vault exposure' }),
			'"Vault exposure" menu option should be visible',
		).toBeVisible();
	}

	@step
	async openVaultsDropdown() {
		await this.page.locator('[class*="VaultsDropdownWrapper_dropdownWrapper_"]').click();
	}

	@step
	async selectVault(name: string) {
		await this.page.locator('[class*="_dropdownOption_"]').filter({ hasText: name }).click();
	}

	@step
	async shouldHavePanelActive(panel: Panels, args?: { timeout: number }) {
		await expect(
			this.panelLocator.getByRole('button', { name: panel }).locator('div').first(),
		).toHaveClass(/_activeButtonText_/, { timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async selectPanel(panel: Panels) {
		await this.panelLocator.getByRole('button', { name: panel }).click();
	}

	@step
	async shouldHaveVaultHeader({
		name,
		asset,
		liveApy,
		nav,
		aum,
		fee,
		inception,
	}: {
		name?: string;
		asset?: EarnTokens;
		liveApy?: string;
		nav?: string;
		aum?: string;
		fee?: string;
		inception?: string;
	}) {
		const fieldLocator = (
			fieldName: 'Name' | 'Asset' | 'Live APY' | 'NAV' | 'AUM' | 'Fee' | 'Inception',
		) =>
			this.page
				.locator('[class*="DashboardVaultHeader_dataBlockWrapper_"]')
				.filter({ hasText: fieldName });

		if (name) {
			await expect(fieldLocator('Name'), `Should have Name: ${name}`).toContainText(name);
		}

		if (asset) {
			await expect(fieldLocator('Asset'), `Should have Asset: ${asset}`).toContainText(asset);
		}

		if (liveApy) {
			const regExp = new RegExp(`${liveApy}${liveApy === 'n/a' ? '' : '%'}`);
			await expect(fieldLocator('Live APY'), `Should have Live APY: ${liveApy}`).toContainText(
				regExp,
			);
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
			await expect(
				fieldLocator('Fee'),
				`Should have Fee: ${fee}${fee === 'n/a' ? '' : '%'}`,
			).toContainText(fee === 'n/a' ? fee : regExp);
		}

		if (inception) {
			await expect(fieldLocator('Inception'), `Should have Inception: ${inception}`).toContainText(
				inception,
			);
		}
	}
}
