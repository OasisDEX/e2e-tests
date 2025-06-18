import { expect, test } from '#earnProtocolFixtures';

test.describe('Beach Club - Portfolio page', async () => {
	test('It should copy referral code', async ({ app, context }) => {
		await app.portfolio.beachClub.openPage('0x90153be2ac32633fc9a7cc53cdf01d348e875555');

		await app.portfolio.beachClub.copyReferralCode();

		await context.grantPermissions(['clipboard-read']);
		const clipboardText1 = await app.page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText1, 'Should have copied referral code in the clipboard').toBe('2000056');
	});

	test('It should copy referral link', async ({ app, context }) => {
		await app.portfolio.beachClub.openPage('0x90153be2ac32633fc9a7cc53cdf01d348e875555');
		await app.portfolio.beachClub.copyReferralLink();

		await context.grantPermissions(['clipboard-read']);
		const clipboardText2 = await app.page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText2, 'Should have copied referral link in the clipboard').toContain(
			'https://summer.fi/earn?referralCode=2000056'
		);
	});

	test('It sould show Referral Reward Overview', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x90153be2ac32633fc9a7cc53cdf01d348e875555');

		await app.portfolio.beachClub.shouldHaveCumulativeTvlFromReferrals(
			'([0-9]{2,3},)?[0-9]{2,3}.[0-9]{2}'
		);
		await app.portfolio.beachClub.shouldHaveEarnedSUMR('([0-9]{1,2},)?[0-9]{2,3}.[0-9]{2}');
		await app.portfolio.beachClub.shouldHaveEarnedFee('<0.01');
	});

	test('It sould show Rewards group in which user currently is', async ({ app }) => {
		await app.portfolio.beachClub.openPage('0x90153be2ac32633fc9a7cc53cdf01d348e875555');

		await app.portfolio.beachClub.shouldBeInRewardsGroup('500K+');
	});
});
