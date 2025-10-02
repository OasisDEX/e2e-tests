import { expect, test } from '#earnProtocolFixtures';

test.describe('Beach Club - Portfolio page', async () => {
	test('It should not allow to generate a code - Logged out', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x8af4f3fbc5446a3fc0474859b78fa5f4554d4510');
		await app.portfolio.beachClub.generateShouldBeDisabled();
	});

	test('It should copy referral code', async ({ app, context }) => {
		await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');
		await app.portfolio.beachClub.copyReferralCode();

		await context.grantPermissions(['clipboard-read']);
		const clipboardText1 = await app.page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText1, 'Should have copied referral code in the clipboard').toBe('beach-test');
	});

	test('It should copy referral link', async ({ app, context }) => {
		await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');
		await app.portfolio.beachClub.copyReferralLink();

		await context.grantPermissions(['clipboard-read']);
		const clipboardText2 = await app.page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText2, 'Should have copied referral link in the clipboard').toContain(
			'/earn?referralCode=beach-test'
		);
	});

	test('It should list Referral activity logs', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');

		await app.portfolio.beachClub.referralActivity();
		await app.portfolio.beachClub.shouldHaveTabActive('Referral Activity');

		await app.portfolio.beachClub.shouldHaveReferralActivity([
			{
				address: { full: '0x33ad81cfb7d23b0b834bc34dc43028dc5001437f', short: '0x33...1437f' },
				action: 'Withdraw',
				amount: { token: 'usdc', tokenAmount: '-0.0999' },
			},
			{
				address: { full: '0x33ad81cfb7d23b0b834bc34dc43028dc5001437f', short: '0x33...1437f' },
				action: 'Deposit',
				amount: { token: 'usdc', tokenAmount: '0.4999' },
			},
			{
				address: { full: '0x1d2d4e8c46649b6419158cc163612813c9556f91', short: '0x1d...56f91' },
				action: 'Deposit',
				amount: { token: 'usdc', tokenAmount: '0.0499' },
			},
			{
				address: { full: '0x1d2d4e8c46649b6419158cc163612813c9556f91', short: '0x1d...56f91' },
				action: 'Deposit',
				amount: { token: 'eth', tokenAmount: '<0.001' },
			},
			{
				address: { full: '0x471b8da4e8d204e33813f4b337e2dda789038df6', short: '0x47...38df6' },
				action: 'Deposit',
				amount: { token: 'eth', tokenAmount: '<0.001' },
			},
		]);
	});

	test('It should list Referrals summary', async ({ app }) => {
		await expect(async () => {
			await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');

			await app.portfolio.beachClub.yourReferrals();
			await app.portfolio.beachClub.shouldHaveTabActive('Your Referrals');
			await app.portfolio.beachClub.firstReferralShouldBeVisible();
		}).toPass();

		await app.portfolio.beachClub.shouldListReferrals([
			{
				address: { full: '0x2be7486dadecc0ec416cd82cf6a43f5c297d0d74', short: '0x2b...d0d74' },
				tvl: '0.00',
				earnedToDate: '0.00',
				annualisedEarnings: '0.00',
			},
			{
				address: { full: '0x1d2d4e8c46649b6419158cc163612813c9556f91', short: '0x1d...56f91' },
				tvl: '0.[1-9][0-9]{3}',
				earnedToDate: '0.00',
				annualisedEarnings: '0.00',
			},
			{
				address: { full: '0x471b8da4e8d204e33813f4b337e2dda789038df6', short: '0x47...38df6' },
				tvl: '0.[1-9][0-9]{3}',
				earnedToDate: '0.00',
				annualisedEarnings: '0.00',
			},
			{
				address: { full: '0x33ad81cfb7d23b0b834bc34dc43028dc5001437f', short: '0x33...1437f' },
				tvl: '0.[2-6][0-9]{3}',
				earnedToDate: '0.00',
				annualisedEarnings: '0.00',
			},
		]);
	});

	test('It sould show Referral Reward Overview', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');

		await app.portfolio.beachClub.shouldHaveCumulativeTvlFromReferrals('[0-9].[0-9]{2}(0-9]{2})?');
		await app.portfolio.beachClub.shouldHaveEarnedSUMR('0.00');
		await app.portfolio.beachClub.shouldHaveEarnedFee('0.00');
	});

	test('It sould show Rewards group in which user currently is', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');

		await app.portfolio.beachClub.shouldBeInRewardsGroup('Start Referring');
	});

	test('It sould show Referral Reward Simulations', async ({ app }) => {
		await expect(async () => {
			await app.portfolio.beachClub.openPage('0x10649c79428d718621821cf6299e91920284743f');

			await app.portfolio.beachClub.shouldHaveProjectedYearlyRewards('<0.01');
			await app.portfolio.beachClub.shouldHaveYearlyEarnedFees('<0.01');
		}).toPass();
	});
});
