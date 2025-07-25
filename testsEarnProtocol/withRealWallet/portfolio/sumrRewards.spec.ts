import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletSonicFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletSonic';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';
import { expect } from '#earnProtocolFixtures';

const test = testWithSynpress(withRealWalletSonicFixtures);

test.describe('Real wallet - Portfolio - SUMR rewards', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 45_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await expect(async () => {
			await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F?tab=rewards');
			await app.waitForAppToBeStable();
		}).toPass();
	});

	test('It should claim rewards and reject terms', async ({ app }) => {
		await expect(async () => {
			await app.portfolio.rewards.claim();

			await app.portfolio.rewards.claimAndDelegate.shouldBeVisible({
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();

		await app.portfolio.rewards.claimAndDelegate.reject();
		await app.portfolio.rewards.shouldBeVisible();
	});

	test('It should claim rewards (until tx) @regression', async ({ app, metamask }) => {
		await expect(async () => {
			await app.portfolio.rewards.claim();

			await app.portfolio.rewards.claimAndDelegate.shouldBeVisible({
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();

		await app.portfolio.rewards.claimAndDelegate.acceptAndSign();
		await metamask.confirmSignature();

		await app.portfolio.rewards.claimAndDelegate.shouldHaveRewards([
			{
				networkName: 'Base',
				claimable: '[0-9]{2,3}.[0-9]{2}',
				inWallet: '[0-9]{1,2}.[0-9]{2}K',
			},
			{
				networkName: 'Arbitrum',
				claimable: '[0-9].[0-9]{4}',
				inWallet: '[0-9].[0-9]{4}',
			},
			{
				networkName: 'Ethereum',
				claimable: '[0-9]{2,3}.[0-9]{2}',
				inWallet: '[0-9].[0-9]{4}',
			},
			{
				networkName: 'Sonic',
				claimable: '[0-9].[0-9]{3}',
				inWallet: '[0-9].[0-9]{4}',
			},
		]);

		// Base rewards
		await app.portfolio.rewards.claimAndDelegate.claim('Base');
		await metamask.rejectTransaction();

		// Pause to avoid random fails
		await app.page.waitForTimeout(3_000);

		// Arbitrum rewards
		await app.portfolio.rewards.claimAndDelegate.claim('Arbitrum');
		await metamask.approveNewNetwork();
		await metamask.approveSwitchNetwork();
		// Wait for Metamask window to re-open
		await expect(async () => {
			await metamask.rejectTransaction();
		}).toPass();

		// Pause to avoid random fails
		await app.page.waitForTimeout(3_000);

		// Sonic rewards --> This will fail until more SUMR are accrued on Sonic
		await app.portfolio.rewards.claimAndDelegate.claim('Sonic');
		await metamask.approveSwitchNetwork();
		// Wait for Metamaskwindow to re-open
		await expect(async () => {
			await metamask.rejectTransaction();
		}).toPass();

		// Pause to avoid random fails
		await app.page.waitForTimeout(3_000);

		// Mainnet rewards
		await app.portfolio.rewards.claimAndDelegate.claim('Ethereum');
		await metamask.approveSwitchNetwork();
		// Wait for Metamaskwindow to re-open
		await expect(async () => {
			await metamask.rejectTransaction();
		}).toPass();
	});
});
