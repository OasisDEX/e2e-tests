import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

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

	// SUMR page being reconstructed - NEw tests to be created
	test.skip('It should claim $SUMR', async ({ app }) => {
		await app.sumr.viewYourAddress();

		await app.portfolio.shouldBeVisible();
		await app.portfolio.shouldShowWalletAddress('0x1064...4743f', {
			timeout: expectDefaultTimeout * 2,
		});
		await app.portfolio.shouldHaveTabHighlighted('SUMR Rewards');
	});
});
