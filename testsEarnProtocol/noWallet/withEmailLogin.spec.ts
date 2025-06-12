import { test } from '#earnProtocolFixtures';
import { logInWithEmailAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

test.describe('Logged in with Email', async () => {
	test(`It should open Portfolio page and Portfolio's Beach Club tab when logged in`, async ({
		app,
		request,
	}) => {
		test.setTimeout(longTestTimeout);

		await logInWithEmailAddress({
			request,
			app,
			emailAddress: 'tester1@summer.testinator.com',
			shortenedWalletAddress: '0xD8bB...2430C',
		});

		// Portfolio page
		await app.header.portfolio();
		await app.portfolio.shouldShowWalletAddress('0xD8bB...2430C', {
			timeout: expectDefaultTimeout * 2,
		});

		// Beach Club tab
		await app.header.beachClub();
		await app.portfolio.beachClub.shouldHaveBeachClubInUrl();
		await app.portfolio.beachClub.shouldBeVisible();
	});
});
