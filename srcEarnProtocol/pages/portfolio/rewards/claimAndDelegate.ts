import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class ClaimAndDelegate {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Claim & Delegate'),
			'"Claim & Delegate" header should be visible'
		).toBeVisible();
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
	async shouldHaveEarnedRewards({ sumr, usd }: { sumr: string; usd: string }) {
		const sumrRegExp = new RegExp(sumr);
		const usdRegExp = new RegExp(`\\$.*${usd}`);
		const haveEarnedLocator = this.page.locator('p:has-text("You have earned")');

		await expect(haveEarnedLocator.locator('xpath=//following-sibling::div[1]')).toContainText(
			sumrRegExp
		);
		await expect(haveEarnedLocator.locator('xpath=//following-sibling::p[1]')).toContainText(
			usdRegExp
		);
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
