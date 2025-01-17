import { test } from '#earnProtocolFixtures';
import { logInWithEmailAddress } from 'srcEarnProtocol/utils/logIn';

test.describe.skip('Logged in with Email', async () => {
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

	// TODO
	test('<TODO>', async ({ app }) => {
		// await app.pause();
	});
});
