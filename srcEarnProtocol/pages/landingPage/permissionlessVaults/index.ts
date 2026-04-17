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
}
