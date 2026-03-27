import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class NetApy {
	readonly page: Page;

	readonly feeLocator: Locator;

	readonly liveApyLocator: Locator;

	readonly netApyLocator: Locator;

	readonly sumrRewardsLocator: Locator;

	readonly tooltipLocator: Locator;

	readonly wstethRewardsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.tooltipLocator = this.page.locator('[class*="_tooltipOpen_"]');
		this.feeLocator = this.tooltipLocator
			.getByText('Management Fee:')
			.locator('xpath=//following-sibling::p[1]');
		this.liveApyLocator = this.tooltipLocator.getByText('Lazy Summer Live APY:');
		this.netApyLocator = this.tooltipLocator
			.getByText('Net APY:')
			.locator('xpath=//following-sibling::*[1]');
		this.sumrRewardsLocator = this.tooltipLocator
			.getByText('$SUMR Token Rewards:')
			.locator('xpath=//following-sibling::p');
		this.wstethRewardsLocator = this.tooltipLocator
			.getByText('WSTETH Token Rewards:')
			.locator('xpath=//following-sibling::p');
	}

	@step
	async shouldBeVisible() {
		await expect(this.tooltipLocator, 'APY tooltip should be opened').toBeVisible();
	}

	@step
	async shouldHave({
		liveNativeApy,
		sumrRewards,
		wstethRewards,
		managementFee,
		netApy,
	}: {
		liveNativeApy?: string;
		sumrRewards?: string;
		wstethRewards?: string;
		managementFee?: string;
		netApy?: string;
	}) {
		if (liveNativeApy) {
			const regExp = new RegExp(`Lazy.*Summer.*Live.*APY:.*${liveNativeApy}%`);
			await expect(this.liveApyLocator).toContainText(regExp);
		}

		if (sumrRewards) {
			const regExp = new RegExp(`${sumrRewards}%`);
			await expect(this.sumrRewardsLocator).toContainText(regExp);
		}

		if (wstethRewards) {
			const regExp = new RegExp(`${wstethRewards}%`);
			await expect(this.wstethRewardsLocator).toContainText(regExp);
		}

		if (managementFee) {
			const regExp = new RegExp(`-${managementFee}%`);
			await expect(this.feeLocator).toContainText(regExp);
		}

		if (netApy) {
			const regExp = new RegExp(`${netApy}%`);
			await expect(this.netApyLocator).toContainText(regExp);
		}
	}

	@step
	async getDetails(args?: { withWstethRewards: boolean }) {
		const details = {
			liveNativeApy: '',
			sumrRewards: '',
			wstethRewards: '',
			managementFee: '',
			netApy: '',
		};

		const liveNativeApy: string = await this.liveApyLocator.innerText();
		details.liveNativeApy = liveNativeApy.substring(
			liveNativeApy.indexOf(':') + 2,
			liveNativeApy.indexOf('%'),
		);

		const sumrRewards: string = await this.sumrRewardsLocator.innerText();
		details.sumrRewards = sumrRewards.replace('%', '');

		if (args?.withWstethRewards) {
			const wstethRewards: string = await this.wstethRewardsLocator.innerText();
			details.wstethRewards = wstethRewards.replace('%', '');
		}

		const managementFee: string = await this.feeLocator.innerText();
		details.managementFee = managementFee.substring(
			managementFee.indexOf('-') + 1,
			managementFee.indexOf('%'),
		);

		const netApy: string = await this.netApyLocator.innerText();
		details.netApy = netApy.replace('%', '');

		return details;
	}
}
