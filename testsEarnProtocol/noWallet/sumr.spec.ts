import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('$SUMR', async () => {
	test.beforeEach(async ({ app }) => {
		await app.sumr.openPage();

		// Wait for 'Log in' button to avoid random fails
		await app.header.shouldShowLogInButton();
	});

	// Functionality removed from new design for
	test.skip('It should open log in popup', async ({ app }) => {
		await app.sumr.connectWallet();
		await app.modals.logIn.shouldBeVisible();
	});

	// Functionality removed from new design for
	test.skip('It should check address', async ({ app }) => {
		await app.sumr.enterAddress('0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789');
		await app.sumr.checkAddress();

		await app.portfolio.shoulBeVisible();
		await app.portfolio.shouldShowWalletAddress('0x88a1...f7789', {
			timeout: expectDefaultTimeout * 4,
		});
		await app.portfolio.shouldHaveTabHighlighted('SUMR Rewards');
	});

	test('It should Buy SUMR', async ({ app }) => {
		await app.sumr.buySUMR();

		// TO DO (functionality not implemented yet)
		// - Assert 'Buy SUMR' functionality
	});

	['Intro', 'What you need to know'].forEach((section) =>
		test(`I should Stake SUMR - Button in "${section}"`, async ({ app }) => {
			await app.sumr.stakeSUMR('Intro');

			// TO DO (functionality not implemented yet)
			// - Assert 'Stake SUMR' functionality
		})
	);

	test('It should show yield source', async ({ app }) => {
		await app.sumr.shouldHaveYieldSource();
	});

	test('It should show "What you need to know" tabs', async ({ app }) => {
		//
		await app.pause();
		//

		// "Timeline" tab
		await app.sumr.selectWhatYouNeedToKnowTab('Timeline');

		//
		await app.pause();
		//

		// "FAQ" tab
		await app.sumr.selectWhatYouNeedToKnowTab('FAQ');

		//
		await app.pause();
		//

		// "Facts" tab
		await app.sumr.selectWhatYouNeedToKnowTab('Facts');

		//
		await app.pause();
		//
	});
});
