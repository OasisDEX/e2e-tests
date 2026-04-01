import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { ArbitrumUsdcArks, BaseUsdcArks } from 'srcInstitutions/utils/types';

export class Overview {
	readonly page: Page;

	readonly showArkApysSliderLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.showArkApysSliderLocator = this.page
			.getByText('Show ark APYs', { exact: true })
			.locator('..')
			.locator('[class*="_slider_"]');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Performance' }),
			'"Performance" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'AUM' }),
			'"AUM" header should be visible',
		).toBeVisible();
	}

	@step
	async shouldHavePerformanceChart() {
		await expect(
			this.page.locator('[class*="_navPriceChart_"]'),
			'Should dispay Performance chart',
		).toBeVisible();
	}

	@step
	async shouldHaveApyChart() {
		await expect(
			this.page.locator('[class*="_arkHistoricalYieldChart_"]'),
			'Should dispay APY chart',
		).toBeVisible();
	}

	@step
	async shouldHaveAumChart() {
		await expect(
			this.page.locator('[class*="_aumChart_"]'),
			'Should dispay AUM chart',
		).toBeVisible();
	}

	@step
	async switchShowArkApys() {
		await this.showArkApysSliderLocator.click();
	}

	@step
	async shouldHaveShowArkApysFeature(status: 'On' | 'Off') {
		const backgroundColor = await this.showArkApysSliderLocator.evaluate((el) => {
			return window.getComputedStyle(el).getPropertyValue('background-color');
		});

		const actualStatus = backgroundColor === 'rgb(255, 73, 164)' ? 'On' : 'Off';

		expect(actualStatus, `Stacked feature should be ${status}`).toEqual(status);
	}

	@step
	async shouldHaveYieldsLegends(arks: BaseUsdcArks[] | ArbitrumUsdcArks[]) {
		for (const ark of arks) {
			await expect(
				this.page.locator('[class*="YieldsLegend_legendItem_"]').filter({ hasText: ark }),
				`"${ark}" legend should be visible`,
			).toBeVisible();
		}
	}

	@step
	async shouldNotHaveYieldsLegends(arks: BaseUsdcArks[] | ArbitrumUsdcArks[]) {
		for (const ark of arks) {
			await expect(
				this.page.locator('[class*="YieldsLegend_legendItem_"]').filter({ hasText: ark }),
				`"${ark}" legend should NOT be visible`,
			).not.toBeVisible();
		}
	}

	@step
	async openChartTooltip({ chart }: { chart: 'Performance' | 'APY' | 'AUM' }) {
		await this.page
			.locator(
				`${chart === 'Performance' ? '[class*="_navPriceChart_"]' : chart === 'APY' ? '[class*="_arkHistoricalYieldChart_"]' : '[class*="_aumChart_"]'} [class="recharts-wrapper"] [class*="recharts-layer"]`,
			)
			.first()
			.hover({ position: { x: 15, y: 3 }, force: true });
	}

	@step
	async shouldHavePerformanceChartTooltip() {
		const date = '[0-3][0-9].*[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec].*202[5-9]';
		const netAsset = 'Net Asset Value.*:.*[0-1].[0-9]{4}';

		const regExp = new RegExp(`${date}.*${netAsset}`);
		await expect(
			this.page.locator('[class*="_navPriceChart_"] [class="recharts-default-tooltip"]'),
		).toContainText(regExp);
	}

	@step
	async shouldHaveApyChartTooltip({
		vault,
		withArks,
	}: {
		vault: 'arbitrum' | 'base';
		withArks: boolean;
	}) {
		const tooltipInfo_arbitrumVault = {
			date: '[0-3][0-9].*[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec].*202[5-9]',
			arbitrumVault: 'ExtDemoCorp USDC arbitrum.*:.*[0-9](.[0-9]{2}%)?',
			aaveV3: 'Aave V3 USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			compoundV3: 'Compound V3 USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			fluidFToken: 'FluidFToken USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			morphoGauntletCore: 'Morpho USDC Gauntlet Core.*:.*[0-9]{1,2}.[0-9]{2}',
			morphoGauntletPrime: 'Morpho USDC Gauntlet Prime.*:.*[0-9]{1,2}.[0-9]{2}',
		};

		const tooltipInfo_baseVault = {
			date: '[0-3][0-9].*[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec].*202[5-9]',
			baseVault: 'ExtDemoCorp USDC base.*:.*[0-9](.[0-9]{2}%)?',
			fluidFToken: 'FluidFToken USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			morphoMoonwellFlagship: 'Morpho USDC Moonwell Flagship.*:.*[0-9]{1,2}.[0-9]{2}',
			compoundV3: 'Compound V3 USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			aaveV3: 'Aave V3 USDC.*:.*[0-9]{1,2}.[0-9]{2}',
			morphoGauntletPrime: 'Morpho USDC Gauntlet Prime.*:.*[0-9]{1,2}.[0-9]{2}',
			morphoSteakhouse: 'Morpho USDC Steakhouse.*:.*[0-9]{1,2}.[0-9]{2}',
			skyUsds: 'SkyUsds USDC.*:.*[0-9]{1,2}.[0-9]{2}',
		};

		if (!withArks) {
			const noArksRegExp = new RegExp(
				vault === 'arbitrum'
					? `${tooltipInfo_arbitrumVault.date}.*${tooltipInfo_arbitrumVault.arbitrumVault}`
					: `${tooltipInfo_baseVault.date}.*${tooltipInfo_baseVault.baseVault}`,
			);

			await expect(
				this.page.locator(
					'[class*="_arkHistoricalYieldChart_"] [class="recharts-default-tooltip"]',
				),
			).toContainText(noArksRegExp);
		} else {
			for (const [key, value] of Object.entries(
				vault === 'arbitrum' ? tooltipInfo_arbitrumVault : tooltipInfo_baseVault,
			)) {
				const regExp = new RegExp(value);
				await expect(
					this.page.locator(
						'[class*="_arkHistoricalYieldChart_"] [class="recharts-default-tooltip"]',
					),
					`Should display '${key}' info: ${value}`,
				).toContainText(regExp);
			}
		}
	}

	@step
	async shouldHaveAumChartTooltip() {
		const date = '[0-3][0-9].*[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec].*202[5-9]';
		const netAsset = 'Assets Under Management.*:.*[0-9]{3,4}.[0-9]{2}';

		const regExp = new RegExp(`${date}.*${netAsset}`);
		await expect(
			this.page.locator('[class*="_aumChart_"] [class="recharts-default-tooltip"]'),
		).toContainText(regExp);
	}

	@step
	async shouldHaveContractAddresses({
		fleet,
		admiralsQuarters,
		harborCommand,
	}: {
		fleet?: string;
		admiralsQuarters?: string;
		harborCommand?: string;
	}) {
		const contractsTableRowLocator = this.page
			.getByRole('table')
			.filter({ has: this.page.locator('th:has-text("Contract")') })
			.locator('tr');

		if (fleet) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Fleet' })).toContainText(fleet);
		}

		if (admiralsQuarters) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Admirals Quarters' })).toContainText(
				admiralsQuarters,
			);
		}

		if (harborCommand) {
			await expect(contractsTableRowLocator.filter({ hasText: 'Harbor Command' })).toContainText(
				harborCommand,
			);
		}
	}
}
