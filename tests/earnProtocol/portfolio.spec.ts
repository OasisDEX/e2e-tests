import { test } from '#earnProtocolFixtures';

test.describe('Portfolio', async () => {
	test('It should show wallet address', async ({ app }) => {
		await app.portfolio.open('0xA1B008dBA9F6143c6211767cbA826296f95Fe3B3');
		await app.portfolio.shouldShowWalletAddress('0xA1B0...Fe3B3');
	});

	test('It should show Total $SUMR and Total Wallet value', async ({ app }) => {
		await app.portfolio.open('0xA1B008dBA9F6143c6211767cbA826296f95Fe3B3');
		await app.portfolio.shouldShowOverviewAmounts({
			total$SUMR: '[0-9]{2,3}',
			totalWallet: '[0-9]{1,2}',
		});
	});

	test('It should show switch to all Portfolio tabs', async ({ app }) => {
		await app.portfolio.open('0xA1B008dBA9F6143c6211767cbA826296f95Fe3B3');

		// Switch to 'Wallet' tab
		await app.portfolio.selectTab('Wallet');
		await app.portfolio.wallet.shouldBeVisible();

		// Switch to 'Rebalance Activity' tab
		await app.portfolio.selectTab('Rebalance Activity');
		await app.portfolio.rebalanceActivity.shouldBeVisible();

		// Switch to 'Rewards' tab
		await app.portfolio.selectTab('Rewards');
		await app.portfolio.rewards.shouldBeVisible();

		// Switch to 'Overview' tab
		await app.portfolio.selectTab('Overview');
		await app.portfolio.overview.shouldBeVisible();
	});
});
