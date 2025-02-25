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
	async shouldHaveRewards(
		networks: {
			networkName: 'Arbitrum' | 'Base' | 'Ethereum';
			claimable: string;
			inWallet: string;
		}[]
	) {
		for (const network of networks) {
			const claimableRegExp = new RegExp(network.claimable);
			const inWalletRegExp = new RegExp(network.inWallet);

			const rewardsCard = this.page
				.locator('[class*="ClaimDelegateClaimStep_cardWrapper"]')
				.filter({ has: this.page.getByText(network.networkName) });

			await expect(rewardsCard.getByRole('heading')).toContainText(claimableRegExp);
			await expect(rewardsCard.getByText('in wallet')).toContainText(inWalletRegExp);
		}
	}

	@step
	async claim(network: 'Arbitrum' | 'Base' | 'Ethereum') {
		await this.page
			.locator('[class*="ClaimDelegateClaimStep_cardWrapper"]')
			.filter({ has: this.page.getByText(network) })
			.locator('button:has-text("Claim")')
			.click();
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
