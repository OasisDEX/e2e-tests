import { test } from '#earnProtocolFixtures';
import { logInWithEmailAddress } from 'srcEarnProtocol/utils/logIn';

test.describe('Logged in with Email', async () => {
	test.beforeEach(async ({ app, request }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithEmailAddress({
			request,
			app,
			emailAddress: 'tester@summer.testinator.com',
			shortenedWalletAddress: '0x91be...5CC30',
		});
	});

	test('It should open portfolio page', async ({ app }) => {
		await app.header.portfolio();
		await app.portfolio.shouldShowWalletAddress('0x91be...5CC30');
	});
});
