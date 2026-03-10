import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { VaultsCarousel } from './vaultsCarousel';
import { earnProtocolBaseUrl, expectDefaultTimeout } from 'utils/config';

export class LandingPage {
	readonly page: Page;

	readonly selectedVaultCardLocator: Locator;

	readonly vaultsCarousel: VaultsCarousel;

	constructor(page: Page) {
		this.page = page;
		this.vaultsCarousel = new VaultsCarousel(page);
		this.selectedVaultCardLocator = page.locator(
			'[class*="_vaultCardHomepageContentWrapperSelected_"]',
		);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Automated Exposure to DeFi'),
			'"Automated Exposure..." should be visible',
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto(earnProtocolBaseUrl.split('/earn')[0]);
			await expect(
				this.page.getByText('Automated Exposure to DeFi'),
				'"Automated Exposure..." should be visible',
			).toBeVisible();
		}).toPass();
	}

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
	async viewAllStrategies() {
		await this.page.getByRole('link', { name: 'View all' }).click();
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

	/*
	 * CTA in HigherYieldsBlock
	 */
	@step
	async learnMore() {
		await this.page
			.locator('[class*="HigherYieldsBlock_"]')
			.getByRole('link', { name: 'Learn more' })
			.click();
	}

	@step
	async deposit() {
		await this.page.getByRole('link', { name: 'Deposit' }).click();
	}
}
