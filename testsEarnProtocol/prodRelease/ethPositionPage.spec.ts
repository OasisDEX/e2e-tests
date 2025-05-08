import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Prod release - Position page - Base - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x2bb9ad69feba5547b7cd57aafe8457d40bf834af/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should deposit ETH (until rejecting first tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'CBETH',
			depositAmount: '0.0005',
		});
	});
});
