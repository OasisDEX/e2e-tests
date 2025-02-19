import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class ClaimAndDelegate {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout?: number }) {
		await expect(
			this.page.getByText('Claim & Delegate'),
			'"Claim & Delegate" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldHaveButton(
		button: 'Reject' | 'Accept & Sign' | 'Loading' | 'Continue',
		args?: { hidden: boolean }
	) {
		if (args?.hidden) {
			await expect(this.page.locator(`button:has-text("${button}")`)).not.toBeVisible();
		} else {
			await expect(this.page.locator(`button:has-text("${button}")`)).toBeVisible();
		}
	}

	@step
	async reject() {
		await this.page.locator('button:has-text("Reject terms")').click();
	}

	@step
	async acceptAndSign() {
		await this.page.locator('button:has-text("Accept & Sign")').click();
	}

	@step
	async continue() {
		await this.page.locator('button:has-text("Continue")').click();
	}

	@step
	async shouldHaveEarnedRewards(
		networks: {
			networkName: 'ARBITRUM' | 'BASE' | 'MAINNET';
			sumr: string;
			usd: string;
		}[]
	) {
		for (const network of networks) {
			const sumrRegExp = new RegExp(network.sumr);
			const usdRegExp = new RegExp(`\\$.*${network.usd}`);
			const rewardsCard = this.page
				.locator('p:has-text("You have earned")')
				.locator('..')
				.filter({ has: this.page.getByText(`${network.networkName} Network`) });

			await expect(rewardsCard.getByRole('heading')).toContainText(sumrRegExp);
			await expect(rewardsCard.getByText('$')).toContainText(usdRegExp);
		}
	}

	@step
	async claim() {
		await this.page.locator('button:has-text("Claim")').click();
	}

	@step
	async shouldHaveClaimedRewards({ sumr, usd }: { sumr: string; usd: string }) {
		const sumrRegExp = new RegExp(sumr);
		const usdRegExp = new RegExp(`\\$.*${usd}`);
		const haveEarnedLocator = this.page.locator('p:has-text("You have claimed")');

		await expect(haveEarnedLocator.locator('xpath=//following-sibling::div[1]')).toContainText(
			sumrRegExp
		);
		await expect(haveEarnedLocator.locator('xpath=//following-sibling::p[1]')).toContainText(
			usdRegExp
		);
	}
}
