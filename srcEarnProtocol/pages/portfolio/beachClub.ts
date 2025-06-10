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
	async generateShouldBeEnabled() {
		await expect(this.page.getByRole('button', { name: 'Generate' })).not.toHaveAttribute(
			'disabled'
		);
	}

	@step
	async generateShouldBeDisabled() {
		await expect(this.page.getByRole('button', { name: 'Generate' })).toHaveAttribute('disabled');
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

	@step
	async trackReferrals() {
		await this.page.getByRole('button').filter({ hasText: 'Track referrals' }).click();
	}

	@step
	async referralAcivityShouldBeActive() {
		await expect(
			this.page.locator('button[class*="BeachClubTrackReferrals_tabActive_"]'),
			'"Referral Acivity" tab should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveReferralActivity(
		entries: {
			address: { full: string; short: string };
			action: 'Deposit' | 'Withdraw';
			amount: { token: 'eth' | 'usdc'; tokenAmount: string };
			date: string;
		}[]
	) {
		for (const entry of entries) {
			const entryLocator = this.page
				.locator('[class*="BeachClubTrackReferrals_beachClubTrackReferralsWrapper_"]')
				.getByRole('row')
				.filter({ hasText: entry.address.short })
				.filter({ hasText: entry.action })
				.filter({ has: this.page.locator(`svg[title*="${entry.amount.token}"]`) });

			await expect(entryLocator.getByRole('cell').nth(2)).toContainText(entry.amount.tokenAmount);

			await expect(entryLocator.getByRole('cell').nth(3)).toContainText(entry.date);

			await expect(entryLocator.getByRole('cell').nth(4).getByRole('button')).toContainText('View');
			await expect(entryLocator.getByRole('cell').nth(4).getByRole('link')).toHaveAttribute(
				'href',
				`/earn/portfolio/${entry.address.full}?tab=your-activity`
			);
		}
	}
}
