import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Bridge Mainnet SUMR tokens', async () => {
	test.beforeEach(async ({ metamask, app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.portfolio.bridge.open('0x10649c79428d718621821cf6299e91920284743f');
		await app.portfolio.bridge.selectNetwork({ fromOrTo: 'From', network: 'Mainnet' });
		await metamask.approveSwitchNetwork();
	});

	test('Bridge Mainnet to Base', async ({ app, metamask }) => {
		await app.portfolio.bridge.shouldHaveBalance('0.[0-9]{4}');
		await app.portfolio.bridge.enterAmount('0.0010');
		await app.portfolio.bridge.shouldHaveAmountInUSD('0.000[1-4]');
		await app.portfolio.bridge.confirmBridge();
		await metamask.rejectTransaction();
	});
});
