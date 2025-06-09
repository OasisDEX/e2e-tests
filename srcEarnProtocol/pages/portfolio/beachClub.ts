import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class BeachClub {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async openPage(wallet: string) {
		await expect(async () => {
			await this.page.goto(`https://staging.summer.fi/earn/portfolio/${wallet}?tab=beach-club`);
			await expect(
				this.page.getByText('Unlock exclusive rewards with Lazy Summer Beach Club.'),
				'Tab header should be visible'
			).toBeVisible({ timeout: expectDefaultTimeout * 2 });
		}).toPass({ timeout: expectDefaultTimeout * 5 });
	}

	@step
	async shouldShowConnectWallet(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Connect your wallet to access the Beach Club page')
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldHaveBeachClubInUrl(args?: { timeout: number }) {
		await expect(async () => {
			const url = this.page.url();
			expect(url).toContain('/earn/portfolio?tab=beach-club');
		}).toPass({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Unlock exclusive rewards with Lazy Summer Beach Club'),
			'"Lazy Summer Beach Club" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });

		await expect(
			this.page.getByText('Refer and earn'),
			'"Refer and earn" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });

		await expect(
			this.page.getByText('Beach Club Rewards', { exact: true }),
			'"Beach Club Rewards" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async copyReferralCode() {
		await this.page
			.getByRole('button')
			.filter({ has: this.page.locator('[class*="BeachClubHowItWorks_copyWrapper"]') })
			.click();
	}

	@step
	async copyReferralLink() {
		await this.page
			.getByRole('button')
			.filter({ has: this.page.locator('[class*="BeachClubHowItWorks_socialMediaLink"]') })
			.click();
	}
}
