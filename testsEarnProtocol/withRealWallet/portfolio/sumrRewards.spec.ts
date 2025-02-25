import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Real wallet - Portfolio - SUMR rewards', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F?tab=rewards');
	});

	test('It should claim rewards and reject terms', async ({ app }) => {
		await app.portfolio.rewards.claim();

		await app.portfolio.rewards.claimAndDelegate.shouldBeVisible({
			timeout: expectDefaultTimeout * 2,
		});

		await app.portfolio.rewards.claimAndDelegate.reject();
		await app.portfolio.rewards.shouldBeVisible();
	});

	test('It should claim rewards (until tx)', async ({ app, metamask }) => {
		await app.portfolio.rewards.claim();

		await app.portfolio.rewards.claimAndDelegate.shouldBeVisible({
			timeout: expectDefaultTimeout * 2,
		});

		await app.portfolio.rewards.claimAndDelegate.acceptAndSign();
		await metamask.confirmSignature();

		await app.portfolio.rewards.claimAndDelegate.shouldHaveRewards([
			{
				networkName: 'Base',
				claimable: '[0-9].[0-9]{4}',
				inWallet: '0.00',
			},
			{
				networkName: 'Arbitrum',
				claimable: '[0-9].[0-9]{4}',
				inWallet: '[0-9].[0-9]{4}',
			},
			{
				networkName: 'Ethereum',
				claimable: '0.00',
				inWallet: '0.00',
			},
		]);

		await app.portfolio.rewards.claimAndDelegate.claim('Base');
		await metamask.rejectTransaction();
	});
});
