import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Mainnet ETH Lower Risk position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 45_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x67e536797570b3d8919df052484273815a0ab506/0x10649c79428d718621821cf6299e91920284743f',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should switch Mainnet ETH Lower Risk position', async ({ app, metamask }) => {
		// USDC Lower Risk
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			risk: 'Lower Risk',
		});
	});
});
