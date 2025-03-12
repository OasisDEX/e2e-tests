import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Portfolio', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 45_000);
	});

	test('It should show wallet address', async ({ app }) => {
		await app.portfolio.open('0x548b79cb42d4a204765e9a9e599b83d4225319a9');
		await app.portfolio.shouldShowWalletAddress('0x548b...319a9');
	});

	test('It should show Total $SUMR and Total Wallet value', async ({ app }) => {
		await app.portfolio.open('0xbEf4befb4F230F43905313077e3824d7386E09F8');
		await app.portfolio.shouldShowOverviewAmounts({
			total$SUMR: '[0-9]{1,2}.[0-9]{2}',
			totalWallet: '[0-9]{1,2}.[0-9]{2}',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should switch to all Portfolio main tabs', async ({ app }) => {
		await app.portfolio.open('0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA');
		await app.waitForAppToBeStable();

		// Switch to 'Wallet' tab
		await app.portfolio.selectTab('Wallet');
		await app.portfolio.wallet.shouldBeVisible();

		// Switch to 'Your Activity' tab
		await app.portfolio.selectTab('Your Activity');
		await app.portfolio.yourActivity.shouldBeVisible();

		// Switch to 'Rebalance Activity' tab
		await app.portfolio.selectTab('Rebalance Activity');
		await app.portfolio.rebalanceActivity.shouldBeVisible();

		// Switch to 'Rewards' tab
		await app.portfolio.selectTab('$SUMR Rewards');
		await app.portfolio.rewards.shouldBeVisible();

		// Switch to 'Overview' tab
		await app.portfolio.selectTab('Overview');
		await app.portfolio.overview.shouldBeVisible();
	});
});
