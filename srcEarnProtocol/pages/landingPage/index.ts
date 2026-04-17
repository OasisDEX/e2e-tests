import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { earnProtocolBaseUrl, expectDefaultTimeout } from 'utils/config';
import { BuildYourOwnVault } from './buildYourOwnVault';
import { IntegrateDefiYield } from './integrateDefiYield';
import { PermissionlessVaults } from './permissionlessVaults';
import { PermissionedRwaVault } from './permisionedRwaVault';
import { VaultsCarousel } from './vaultsCarousel';

type Products =
	| 'Permissionless DeFi Vaults'
	| 'Permissioned RWA Vaults'
	| 'Build your own DeFi Vault'
	| 'Integrate high quality DeFi yield';

const productCardIds = {
	'Permissionless DeFi Vaults': 'permissionless-defi-vaults',
	'Permissioned RWA Vaults': 'permissioned-rwa-vaults',
	'Build your own DeFi Vault': 'build-your-own-defi-vault',
	'Integrate high quality DeFi yield': 'integrate-high-quality-defi-yield',
};

export class LandingPage {
	readonly page: Page;

	readonly buildYourOwnVault: BuildYourOwnVault;

	readonly heroBannerLocator: Locator;

	readonly heroBannerStatLocator: Locator;

	readonly integrateDefiYield: IntegrateDefiYield;

	readonly permissionedRwaVault: PermissionedRwaVault;

	readonly permissionlessVaults: PermissionlessVaults;

	// readonly productLocator: Locator;

	readonly selectedVaultCardLocator: Locator;

	readonly vaultsCarousel: VaultsCarousel;

	constructor(page: Page) {
		this.page = page;
		this.buildYourOwnVault = new BuildYourOwnVault(page);
		this.heroBannerLocator = page.locator('[class*="LandingPageHero_"]');
		this.heroBannerStatLocator = page.locator('[class*="_heroStat_"]');
		this.integrateDefiYield = new IntegrateDefiYield(page);
		this.permissionedRwaVault = new PermissionedRwaVault(page);
		this.permissionlessVaults = new PermissionlessVaults(page);
		// this.productLocator = page.locator('article[class*="OurProductsList_"]');
		this.vaultsCarousel = new VaultsCarousel(page);
		this.selectedVaultCardLocator = page.locator(
			'[class*="_vaultCardHomepageContentWrapperSelected_"]',
		);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText(/Earn more.*, do less/),
			'"Earn more, do less" header should be visible',
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto(earnProtocolBaseUrl.split('/earn')[0]);
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveSummary({
		tvl,
		numberOfVaults,
		marketsOptimized,
		maxApy,
	}: {
		tvl?: string;
		numberOfVaults?: string;
		marketsOptimized?: string;
		maxApy?: string;
	}) {
		if (tvl) {
			const regExp = new RegExp(`\\$${tvl}`);

			await expect(this.heroBannerStatLocator.filter({ hasText: 'TVL' })).toContainText(regExp);
		}

		if (numberOfVaults) {
			const regExp = new RegExp(numberOfVaults);

			await expect(this.heroBannerStatLocator.filter({ hasText: '# of Vaults' })).toContainText(
				regExp,
			);
		}

		if (marketsOptimized) {
			const regExp = new RegExp(marketsOptimized);

			await expect(
				this.heroBannerStatLocator.filter({ hasText: 'Markets Optimized' }),
			).toContainText(regExp);
		}

		if (maxApy) {
			const regExp = new RegExp(`${maxApy}%`);

			await expect(this.heroBannerStatLocator.filter({ hasText: 'Max Apy' })).toContainText(regExp);
		}
	}

	@step
	async shouldHaveProducts(products: Products[]) {
		for (const product of products) {
			await expect(
				this.page.locator(`#${productCardIds[product]}`),
				`'${product}' card should be visible`,
			).toHaveAttribute('aria-hidden', 'false');
		}
	}

	@step
	async shouldNotHaveProducts(products: Products[]) {
		for (const product of products) {
			await expect(
				this.page.locator(`#${productCardIds[product]}`),
				`'${product}' card should be visible`,
			).toHaveAttribute('aria-hidden', 'true');
		}
	}

	@step
	async selectProductTab(tab: Products | 'All Vaults') {
		await this.page.getByRole('button', { name: tab }).click();
	}

	@step
	async shouldHaveTabHighlighted(tab: Products | 'All Vaults') {
		await expect(this.page.getByRole('button', { name: tab })).toHaveAttribute(
			'aria-pressed',
			'true',
		);
	}

	/*
	 *	[Learn more] buttons in product cards
	 */
	@step
	async learnMore(product: Products) {
		await this.page
			.locator(`#${productCardIds[product]}`)
			.getByRole('button', { name: 'Learn more' })
			.click();
	}

	@step
	async viewLeadership() {
		await this.page.getByRole('link', { name: 'View leadership' }).click();
	}

	// ===========

	@step
	async shouldShowVaultCard() {
		await expect(
			this.page
				.locator('[class*="homepageCarouselWrapper"] [class*="vaultCardHomepageContentWrapper"]')
				.first(),
			'Vault card should be visible',
		).toBeVisible();
	}

	@step
	async getSelectedCardNetApy(): Promise<string> {
		const netApy: string = await this.selectedVaultCardLocator
			.getByText('APY', { exact: true })
			.first()
			.locator('../..')
			.locator('span:has-text("%")')
			.first()
			.innerText();

		return netApy.replace('%', '');
	}

	@step
	async openSelectedCardApyTooltip() {
		await this.selectedVaultCardLocator.locator('[data-tooltip-btn-id]').hover();
	}

	@step
	async launchApp() {
		await this.heroBannerLocator.getByRole('button', { name: 'Launch App' }).click();
	}

	@step
	async selectHigherYieldsTab(
		tab: 'How you earn more' | 'How we use AI to outperform' | 'How you save time and costs',
	) {
		await this.page.getByRole('button', { name: tab }).click();
	}

	@step
	async shouldHaveHieherYieldsTabVisible(
		tab: 'How you earn more' | 'How we use AI to outperform' | 'How you save time and costs',
	) {
		if (tab === 'How you earn more') {
			await expect(
				this.page.getByText('You’re earning DeFi’s highest yields, all of the time.'),
				'"You’re earning DeFi’s highest yields" should be visible',
			).toBeVisible();
		}

		if (tab === 'How we use AI to outperform') {
			await expect(
				this.page.getByText('Always optimized, zero effort.'),
				'"Always optimized" should be visible',
			).toBeVisible();
		}

		if (tab === 'How you save time and costs') {
			await expect(
				this.page.getByText('Save Time, Cut Complexity and forget about Gas Costs'),
				'"Save Time, Cut Complexity" should be visible',
			).toBeVisible();
		}
	}

	/*
	 * CTA in HigherYieldsBlock
	 */
	@step
	async getStarted() {
		this.page
			.locator('[class*="HigherYieldsBlock_"]')
			.getByRole('button', { name: 'Get started' })
			.click();
	}

	@step
	async viewYields() {
		await this.page.getByRole('link', { name: 'View Yields' }).click();
	}

	// /*
	//  * CTA in HigherYieldsBlock
	//  */
	// @step
	// async learnMore() {
	// 	await this.page
	// 		.locator('[class*="HigherYieldsBlock_"]')
	// 		.getByRole('link', { name: 'Learn more' })
	// 		.click();
	// }

	@step
	async deposit() {
		await this.page.getByRole('link', { name: 'Deposit' }).click();
	}
}
