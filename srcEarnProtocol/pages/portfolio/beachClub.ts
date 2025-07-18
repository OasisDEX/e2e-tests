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
			await this.page.goto(`/earn/portfolio/${wallet}?tab=beach-club`);
			await expect(
				this.page.getByText('Unlock exclusive rewards with Lazy Summer Beach Club.'),
				'Tab header should be visible'
			).toBeVisible({ timeout: expectDefaultTimeout * 3 });
		}).toPass({ timeout: expectDefaultTimeout * 7 });
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
			expect(url).toContain('/earn/portfolio');
			expect(url).toContain('?tab=beach-club');
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
	async referralActivity() {
		await this.page.getByRole('button').filter({ hasText: 'Referral Activity' }).click();
	}

	@step
	async yourReferrals() {
		await this.page.getByRole('button').filter({ hasText: 'Your Referrals' }).click();
	}

	@step
	async shouldHaveTabActive(tab: 'Referral Activity' | 'Your Referrals') {
		await expect(async () => {
			const activeTabWidth = await this.page
				.getByRole('button')
				.filter({ hasText: tab })
				.evaluate((el) => {
					return window.getComputedStyle(el).getPropertyValue('--active-tab-width');
				});

			expect(activeTabWidth).toEqual('100%');
		}).toPass({ timeout: expectDefaultTimeout });
	}

	@step
	async shouldHaveReferralActivity(
		entries: {
			address: { full: string; short: string };
			action: 'Deposit' | 'Withdraw';
			amount: { token: 'eth' | 'usdc'; tokenAmount: string };
		}[]
	) {
		for (const entry of entries) {
			const entryLocator = this.page
				.getByRole('row')
				.filter({ hasText: entry.address.short })
				.filter({ hasText: entry.action })
				.filter({ has: this.page.locator(`svg[title*="${entry.amount.token}"]`) });

			await expect(entryLocator.getByRole('cell').nth(2)).toContainText(entry.amount.tokenAmount);

			await expect(entryLocator.getByRole('cell').nth(3)).toContainText(
				/hours ago|yesterday|days ago|last month/
			);

			await expect(entryLocator.getByRole('cell').nth(4).getByRole('button')).toContainText('View');
			await expect(entryLocator.getByRole('cell').nth(4).getByRole('link')).toHaveAttribute(
				'href',
				`/earn/portfolio/${entry.address.full}?tab=your-activity`
			);
		}
	}

	@step
	async shouldListReferrals(
		entries: {
			address: { full: string; short: string };
			tvl: string;
			earnedToDate: string;
			annualisedEarnings: string;
		}[]
	) {
		for (const entry of entries) {
			const entryLocator = this.page.getByRole('row').filter({ hasText: entry.address.short });

			const tvlRegExp = new RegExp(`\\$${entry.tvl}`);
			await expect(entryLocator.getByRole('cell').nth(1), 'Should have TVL').toContainText(
				tvlRegExp
			);

			const earnedToDateRegExp = new RegExp(`\\$${entry.earnedToDate}`);
			await expect(
				entryLocator.getByRole('cell').nth(2),
				'Should have Earned to Date'
			).toContainText(earnedToDateRegExp);

			const annualisedEarningsRegExp = new RegExp(`\\$${entry.annualisedEarnings}`);
			await expect(
				entryLocator.getByRole('cell').nth(3),
				'Should have Forecast Annualised Earnings'
			).toContainText(annualisedEarningsRegExp);

			await expect(entryLocator.getByRole('cell').nth(4).getByRole('button')).toContainText('View');
			await expect(entryLocator.getByRole('cell').nth(4).getByRole('link')).toHaveAttribute(
				'href',
				`/earn/portfolio/${entry.address.full}`
			);
		}
	}

	@step
	async shouldHaveCumulativeTvlFromReferrals(tvl: string) {
		const regExp = new RegExp(`\\$${tvl}`);
		await expect(
			this.page.getByText('Cumulative TVL from referrals').locator('xpath=//preceding::h2[1]')
		).toContainText(regExp);
	}

	@step
	async shouldHaveEarnedSUMR(earneAmount: string) {
		const regExp = new RegExp(earneAmount);
		await expect(
			this.page
				.locator('[class*="BeachClubTvlChallenge_textual_"]')
				.filter({ hasText: 'Earned $SUMR' })
		).toContainText(regExp);
	}

	@step
	async shouldHaveEarnedFee(earneFee: string) {
		const regExp = new RegExp(`\\$${earneFee}`);
		await expect(
			this.page
				.locator('[class*="BeachClubTvlChallenge_textual_"]')
				.filter({ hasText: `Earned Fee's` })
		).toContainText(regExp);
	}

	@step
	async shouldBeInRewardsGroup(group: 'Start Referring' | '10K+' | '100K+' | '250K+' | '500K+') {
		await expect(
			this.page
				.locator('[class*="beachClubTvlChallengeRewardCardWrapper"]')
				.filter({ hasText: group })
				.getByText('You are here!'),
			`Should display "You are here tag" in ${group} block`
		).toBeVisible();
	}

	@step
	async shouldHaveProjectedYearlyRewards(rewards: string) {
		const regExp = new RegExp(rewards);
		await expect(
			this.page.getByText('Projected Yearly SUMR Rewards').locator('xpath=//preceding::h2[1]')
		).toContainText(regExp);
	}

	@step
	async shouldHaveYearlyEarnedFees(earnedFees: string) {
		const regExp = new RegExp(`up to \\$${earnedFees}`);
		await expect(
			this.page.getByText('Yearly Earned Fees').locator('xpath=//preceding::h2[1]')
		).toContainText(regExp);
	}
}
