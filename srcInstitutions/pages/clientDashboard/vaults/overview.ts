import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';

type BaseUsdcArks =
	| 'ExtDemoCorp USDC base'
	| 'FluidFToken USDC'
	| 'Morpho USDC Moonwell Flagship'
	| 'Compound V3 USDC'
	| 'Aave V3 USDC'
	| 'Morpho USDC Gauntlet Prime'
	| 'Morpho USDC Steakhouse'
	| 'SkyUsds USDC';

type ArbitrumUsdcArks =
	| 'ExtDemoCorp USDC arbitrum'
	| 'FluidFToken USDC'
	| 'Morpho USDC Gauntlet Prime'
	| 'Aave V3 USDC'
	| 'Morpho USDC Gauntlet Core'
	| 'Compound V3 USDC';

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
