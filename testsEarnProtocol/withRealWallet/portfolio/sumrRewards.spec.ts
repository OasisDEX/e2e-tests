import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Realwallet - Portfolio - SUMR rewards', async () => {
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

		await app.portfolio.rewards.claimAndDelegate.shouldBeVisible();

		await app.portfolio.rewards.claimAndDelegate.reject();
		await app.portfolio.rewards.shouldBeVisible();
	});

	test('It should claim rewards (until tx))', async ({ app, metamask }) => {
		await app.portfolio.rewards.claim();

		await app.portfolio.rewards.claimAndDelegate.shouldBeVisible();

		await app.portfolio.rewards.claimAndDelegate.acceptAndSign();
		await metamask.confirmSignature();

		await app.portfolio.rewards.claimAndDelegate.continue();
		await app.portfolio.rewards.claimAndDelegate.shouldHaveEarnedRewards({
			sumr: '[0-9].[0-9]',
			usd: '[0-9].[0-9]',
		});

		await app.portfolio.rewards.claimAndDelegate.claim();
		await app.portfolio.rewards.claimAndDelegate.continue();

		await app.portfolio.rewards.claimAndDelegate.shouldHaveClaimedRewards({
			sumr: '[0-9].[0-9]',
			usd: '[0-9].[0-9]',
		});
	});
});
