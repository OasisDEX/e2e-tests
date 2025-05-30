import { expect, test } from '#earnProtocolFixtures';
import { logInWithEmailAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

test.describe('Logged in with Email', async () => {
	test('It should open portfolio page', async ({ app, request }) => {
		test.setTimeout(longTestTimeout);

		await logInWithEmailAddress({
			request,
			app,
			emailAddress: 'tester1@summer.testinator.com',
			shortenedWalletAddress: '0xD8bB...2430C',
		});

		await expect(async () => {
			await app.page.waitForTimeout(1_000);
			await app.page.reload();
			await app.header.portfolio();
			await app.portfolio.shouldShowWalletAddress('0xD8bB...2430C', {
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();
	});
});
