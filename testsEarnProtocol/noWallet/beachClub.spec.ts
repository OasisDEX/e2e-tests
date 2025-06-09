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

	// 	test('It should not allow to generate a code', async ({app}) => {
	// 		await app.
	// 	});
});
