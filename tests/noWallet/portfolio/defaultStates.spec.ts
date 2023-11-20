import { test } from '@playwright/test';
import { App } from '../../../src/app';
import { updateFlagsAndRejectCookies } from 'utils/localStorage';

let app: App;

/*
	These 'Default states' tests will run on 'serial' mode to 
	avoid spending DeBank API credits and save some text execution time.
*/
test.describe.configure({ mode: 'serial' });

test.describe('Default states - Wallet not connected', async () => {
	test.beforeAll(async ({ browser }) => {
		const page = await browser.newPage();
		app = new App(page);

		await app.page.goto('');
		await app.homepage.shouldBeVisible();

		if (process.env.FLAGS) {
			await updateFlagsAndRejectCookies({ app, flags: process.env.FLAGS.split(' ') });
		} else {
			updateFlagsAndRejectCookies({ app, flags: ['BaseNetworkEnabled'] });
		}

		await app.portfolio.open('0x8Af4F3fbC5446a3fc0474859B78fA5f4554D4510');
	});

	test.afterAll(async () => {
		await app.page.close();
	});

	test('It should show wallet address top banner - Wallet not connected @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12873',
		});

		await app.portfolio.shouldHaveViewingWalletBanner({
			shortenedAddress: '0x8af4...d4510',
			description: 'Connect your wallet to see what positions you could open',
		});
	});

	test('It should show wallet address @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12848',
		});

		await app.portfolio.shouldHaveWalletAddress('0x8Af4...D4510');
	});

	test(`It should link to wallet's etherscan @regression`, async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12849',
		});

		await app.portfolio.shouldLinktoEtherscan('0x8Af4F3fbC5446a3fc0474859B78fA5f4554D4510');
	});

	test('It should show "Positions" tab by default @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12751',
		});

		await app.portfolio.positions.shouldBeVisible();
	});

	test('It should allow user to connect wallet from "wallet address" top banner - Wallet not connected @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12874',
		});

		await app.portfolio.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});
});
