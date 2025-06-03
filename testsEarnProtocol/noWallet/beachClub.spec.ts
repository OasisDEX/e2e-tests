import { test } from '#earnProtocolFixtures';
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

// test.describe('Beach Club - Portfolio page', async () => {
// 	test();
// });
