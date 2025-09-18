import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('$SUMR', async () => {
	test.beforeEach(async ({ app }) => {
		await app.sumr.openPage();

		// Wait for 'Log in' button to avoid random fails
		await app.header.shouldShowLogInButton();
	});

	test('It should open log in popup', async ({ app }) => {
		await app.sumr.connectWallet();
		await app.modals.logIn.shouldBeVisible();
	});

	test('It should check address', async ({ app }) => {
		await app.sumr.enterAddress('0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789');
		await app.sumr.checkAddress();

		await app.portfolio.shoulBeVisible();
		await app.portfolio.shouldShowWalletAddress('0x88a1...f7789', {
			timeout: expectDefaultTimeout * 2,
		});
		await app.portfolio.shouldHaveTabHighlighted('$SUMR Rewards');
	});
});
