import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { earnProtocolBaseUrl, expectDefaultTimeout } from 'utils/config';
import { VaultsCarousel } from './vaultsCarousel';

export class PermissionlessVaults {
	readonly page: Page;

	readonly firstVaultCardLocator: Locator;

	readonly vaultsCarousel: VaultsCarousel;

	constructor(page: Page) {
		this.page = page;
		this.firstVaultCardLocator = page
			.locator('[class*="_vaultCardsCarouselWrapper_"] [class*="vaultCardHomepageContentWrapper"]')
			.first();
		this.vaultsCarousel = new VaultsCarousel(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Automated access to DeFi’s best yields,'),
			'"Automated access to" header should be visible',
		).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto(`${earnProtocolBaseUrl.split('/earn')[0]}/permissionless-vaults`, {
				timeout: expectDefaultTimeout * 3,
			});
			await this.shouldBeVisible();
		}).toPass();
	}

	/*
	 *	Asserts first vault card in carousel
	 */
	@step
	async shouldShowVaultCard() {
		await expect(this.firstVaultCardLocator, 'Vault card should be visible').toBeVisible();
	}

	@step
	async getFirstCardNetApy(): Promise<string> {
		const netApy: string = await this.firstVaultCardLocator
			.getByText('APY', { exact: true })
			.first()
			.locator('../..')
			.locator('span:has-text("%")')
			.first()
			.innerText();

		return netApy.replace('%', '');
	}

	@step
	async openFirstCardApyTooltip() {
		await this.firstVaultCardLocator.locator('[data-tooltip-btn-id]').hover();
	}

	@step
	async view(card: 'Actively risk-managed' | 'DAO risk-managed') {
		await this.page
			.locator('[class*="_riskManagedCard_"]')
			.filter({ hasText: card })
			.getByRole('link', { name: 'View' })
			.click();
	}

	@step
	async signUp() {
		await this.page.getByRole('link', { name: 'Sign Up' }).click();
	}

	@step
	async shouldLinkToMigratePage() {
		await expect(this.page.getByRole('link', { name: 'Migrate' })).toHaveAttribute(
			'href',
			'/earn/migrate/user',
		);
		await expect(this.page.getByRole('link', { name: 'Migrate' })).not.toHaveAttribute('target');
	}

	@step
	async migrate() {
		await this.page.getByRole('link', { name: 'Migrate' }).click();
	}

	@step
	async shouldOpenCalendarInNewTab() {
		await expect(this.page.getByRole('link', { name: 'Set up a call' })).toHaveAttribute(
			'href',
			'https://cal.com/jordan-jackson-d278ib/summer.fi-support-call',
		);
		await expect(this.page.getByRole('link', { name: 'Set up a call' })).toHaveAttribute(
			'target',
			'_blank',
		);
	}
}
