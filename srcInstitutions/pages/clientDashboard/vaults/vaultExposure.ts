import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class VaultExposure {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByRole('heading', { name: 'Vault exposure' }),
			'"Vault exposure" header should be visible',
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldHaveAssetAllocationBar() {
		await expect(
			this.page.getByText('Asset allocation'),
			'"Asset allocation" label should be visible',
		).toBeVisible();

		await expect(
			this.page.locator('[class*="_allocationBarItem_"]').first(),
			'Asset allocation bar should be visible',
		).toBeVisible();
	}

	@step
	async shouldHaveVaultExposurePanel(args?: { timeout: number }) {
		await expect(
			this.page.locator('[class*="PanelVaultExposure_tableSection_"] tbody > tr > td').first(),
			'First row of exposure table should be visible',
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async getStrategiesTotalAllocation() {
		const allocations = (
			await this.page
				.locator(
					'[class*="PanelVaultExposure_tableSection_"] tr > td:nth-child(1) p:has-text("allocated")',
				)
				.allInnerTexts()
		).map((text) => parseFloat(text.replace('New!', '').replace('% allocated', '')));

		const totalAllocation = allocations.reduce((a, b) => a + b, 0);

		return totalAllocation;
	}

	async getStrategiesNames() {
		const strategyNames = await this.page
			.locator('[class*="PanelVaultExposure_tableSection_"]')
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') })
			.locator('tr td:nth-child(1) p:nth-child(1)')
			.allInnerTexts();

		return strategyNames;
	}

	@step
	async shouldNotHaveDuplicatedStrategyNames() {
		const names = await this.getStrategiesNames();

		expect(new Set(names).size).toEqual(names.length);
	}

	async getStrategiesApys() {
		const strategyApys = await this.page
			.locator('[class*="PanelVaultExposure_tableSection_"]')
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Strategy")') })
			.locator('tr td:nth-child(2) ')
			.allInnerTexts();

		return strategyApys;
	}

	@step
	async shouldNotHaveStrategyApysEqualToZero() {
		const apys = await this.getStrategiesApys();

		expect(apys.includes('0.00%')).not.toBeTruthy();
	}

	@step
	async shouldHaveArksOnChain(
		arks: {
			name: string;
			apy?: string;
			protocolTvl?: string;
			description?: string;
		}[],
	) {
		for (const ark of arks) {
			const arkLocator = this.page
				.locator('[class*="_availableArksSection_"] [class*="_cardSecondary_"]')
				.filter({ hasText: ark.name });

			await expect(arkLocator, `${ark.name} ark should be listed`).toBeVisible();

			if (ark.apy) {
				const regExp = new RegExp(`${ark.apy}%`);
				await expect(arkLocator.getByText('APY:'), `It should have ${regExp} APY`).toContainText(
					regExp,
				);
			}

			if (ark.protocolTvl) {
				const regExp = new RegExp(ark.protocolTvl);
				await expect(
					arkLocator.getByText('Protocol TVL:'),
					`It should have ${regExp} TVL`,
				).toContainText(regExp);
			}

			if (ark.description) {
				await expect(arkLocator.getByText(ark.description)).toBeVisible();
			}
		}
	}
}
