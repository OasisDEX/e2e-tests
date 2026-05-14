import { testWithSynpress } from '@synthetixio/synpress';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - $SUMR page @regression', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.sumr.openPage();
	});

	test('It should redirect to /staking/manage page', async ({ app }) => {
		await app.sumr.stakeSUMR('Intro');
		await app.staking.manage.shouldBeVisible();

		await app.staking.manage.goBack();
		await app.sumr.shouldBeVisible();

		await app.sumr.stakeSUMR('What you need to know');
		await app.staking.manage.shouldBeVisible();
	});
});
