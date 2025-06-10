import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Beach Club Landing page', async () => {
	test('It should redirect to Portfolio > Beach club when clicking on "Share code"', async ({
		app,
	}) => {
		await app.beachClubLandingPage.open();
		await app.beachClubLandingPage.shareYourCode();

		await app.portfolio.beachClub.shouldHaveBeachClubInUrl({ timeout: expectDefaultTimeout * 2 });
		await app.portfolio.beachClub.shouldShowConnectWallet();
	});
});

test.describe('Beach Club - Portfolio page', async () => {
	test('It should not allow to generate a code - Logged out', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x8af4f3fbc5446a3fc0474859b78fa5f4554d4510');
		await app.portfolio.beachClub.generateShouldBeDisabled();
	});

	test('It should copy referral code and referral link', async ({ app, context }) => {
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

		await app.portfolio.beachClub.trackReferrals();
		await app.portfolio.beachClub.referralAcivityShouldBeActive();

		await app.portfolio.beachClub.shouldHaveReferralActivity([
			{
				address: { full: '0x33ad81cfb7d23b0b834bc34dc43028dc5001437f', short: '0x33...1437f' },
				action: 'Withdraw',
				amount: { token: 'usdc', tokenAmount: '-0.0999' },
				date: 'hours ago',
			},
			{
				address: { full: '0x33ad81cfb7d23b0b834bc34dc43028dc5001437f', short: '0x33...1437f' },
				action: 'Deposit',
				amount: { token: 'usdc', tokenAmount: '0.4999' },
				date: 'yesterday',
			},
			{
				address: { full: '0x1d2d4e8c46649b6419158cc163612813c9556f91', short: '0x1d...56f91' },
				action: 'Deposit',
				amount: { token: 'usdc', tokenAmount: '0.0499' },
				date: 'yesterday',
			},
			{
				address: { full: '0x1d2d4e8c46649b6419158cc163612813c9556f91', short: '0x1d...56f91' },
				action: 'Deposit',
				amount: { token: 'eth', tokenAmount: '<0.001' },
				date: 'yesterday',
			},
			{
				address: { full: '0x471b8da4e8d204e33813f4b337e2dda789038df6', short: '0x47...38df6' },
				action: 'Deposit',
				amount: { token: 'eth', tokenAmount: '<0.001' },
				date: 'yesterday',
			},
		]);
	});
});
