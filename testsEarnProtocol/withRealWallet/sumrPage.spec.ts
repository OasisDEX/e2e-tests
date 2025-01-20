import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - $SUMRpage', async () => {
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

	test('It should claim $SUMR', async ({ app }) => {
		await app.sumr.claim$Sumr();

		await app.portfolio.shoulBeVisible();
		await app.portfolio.shouldShowWalletAddress('0x1064...4743f');
		await app.portfolio.shouldHaveTabHighlighted('SUMR Rewards');
	});
});
