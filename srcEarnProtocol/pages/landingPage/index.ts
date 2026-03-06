import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { VaultsCarousel } from './vaultsCarousel';
import { earnProtocolBaseUrl, expectDefaultTimeout } from 'utils/config';

export class LandingPage {
	readonly page: Page;

	readonly selectedVaultCardLocator: Locator;

	readonly selectedVaultCardTooltipLocator: Locator;

	readonly selectedVaultCardTooltipFeeLocator: Locator;

	readonly selectedVaultCardTooltipLiveApyLocator: Locator;

	readonly selectedVaultCardTooltipNetApyLocator: Locator;

	readonly selectedVaultCardTooltipSumrRewardsLocator: Locator;

	readonly vaultsCarousel: VaultsCarousel;

	constructor(page: Page) {
		this.page = page;
		this.vaultsCarousel = new VaultsCarousel(page);
		this.selectedVaultCardLocator = page.locator(
			'[class*="_vaultCardHomepageContentWrapperSelected_"]',
		);
		this.selectedVaultCardTooltipLocator = this.page.locator('[class*="_tooltipOpen_"]');
		this.selectedVaultCardTooltipFeeLocator = this.selectedVaultCardTooltipLocator
			.getByText('Management Fee:')
			.locator('xpath=//following-sibling::p[1]');
		this.selectedVaultCardTooltipLiveApyLocator =
			this.selectedVaultCardTooltipLocator.getByText('Lazy Summer Live APY:');
		this.selectedVaultCardTooltipNetApyLocator = this.selectedVaultCardTooltipLocator
			.getByText('Net APY:')
			.locator('xpath=//following-sibling::*[1]');
		this.selectedVaultCardTooltipSumrRewardsLocator = this.selectedVaultCardTooltipLocator
			.getByText('$SUMR Token Rewards:')
			.locator('xpath=//following-sibling::p');
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
	async shouldHaveSelectedCardApyTooltipOpened() {
		await expect(this.selectedVaultCardTooltipLocator, 'APY tooltipshouldbe opened').toBeVisible();
	}

	@step
	async shouldHaveSelectedCardTooltipDetails({
		liveNativeApy,
		sumrRewards,
		managementFee,
		netApy,
	}: {
		liveNativeApy?: string;
		sumrRewards?: string;
		managementFee?: string;
		netApy?: string;
	}) {
		if (liveNativeApy) {
			const regExp = new RegExp(`Lazy.*Summer.*Live.*APY:.*${liveNativeApy}%`);
			await expect(this.selectedVaultCardTooltipLiveApyLocator).toContainText(regExp);
		}

		if (sumrRewards) {
			const regExp = new RegExp(`${sumrRewards}%`);
			await expect(this.selectedVaultCardTooltipSumrRewardsLocator).toContainText(regExp);
		}

		if (managementFee) {
			const regExp = new RegExp(`-${managementFee}%`);
			await expect(this.selectedVaultCardTooltipFeeLocator).toContainText(regExp);
		}

		if (netApy) {
			const regExp = new RegExp(`${netApy}%`);
			await expect(this.selectedVaultCardTooltipNetApyLocator).toContainText(regExp);
		}
	}

	@step
	async getSelectedCardTooltipDetails() {
		const details = {
			liveNativeApy: '',
			sumrRewards: '',
			managementFee: '',
			netApy: '',
		};

		const liveNativeApy: string = await this.selectedVaultCardTooltipLiveApyLocator.innerText();
		details.liveNativeApy = liveNativeApy.substring(
			liveNativeApy.indexOf(':') + 2,
			liveNativeApy.indexOf('%'),
		);

		const sumrRewards: string = await this.selectedVaultCardTooltipSumrRewardsLocator.innerText();
		details.sumrRewards = sumrRewards.replace('%', '');

		const managementFee: string = await this.selectedVaultCardTooltipFeeLocator.innerText();
		details.managementFee = managementFee.substring(
			managementFee.indexOf('-') + 1,
			managementFee.indexOf('%'),
		);

		const netApy: string = await this.selectedVaultCardTooltipNetApyLocator.innerText();
		details.netApy = netApy.replace('%', '');

		return details;
	}
}
