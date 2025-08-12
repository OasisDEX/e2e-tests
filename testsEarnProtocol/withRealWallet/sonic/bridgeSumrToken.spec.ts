import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletSonicFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletSonic';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';

const test = testWithSynpress(withRealWalletSonicFixtures);

test.describe('Bridge Sonic SUMR tokens', async () => {
	test.beforeEach(async ({ metamask, app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await app.portfolio.bridge.open('0x10649c79428d718621821cf6299e91920284743f');
		await app.portfolio.bridge.selectNetwork({ fromOrTo: 'From', network: 'Sonic' });
		await metamask.approveSwitchNetwork();
	});

	test('Bridge Sonic to Base', async ({ app, metamask }) => {
		await app.portfolio.bridge.shouldHaveBalance('[0-9].[0-9]{4}');
		await app.portfolio.bridge.enterAmount('0.001');
		await app.portfolio.bridge.shouldHaveAmountInUSD('<0.01');
		await app.portfolio.bridge.confirmBridge();
		await metamask.rejectTransaction();
	});
});
