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

		const featuresFlags = process.env.FLAGS_FEATURES ? process.env.FLAGS_FEATURES.split(' ') : null;
		const automationMinNetValueFlags = process.env.FLAGS_AUTOMATION_MIN_NET_VALUE
			? process.env.FLAGS_AUTOMATION_MIN_NET_VALUE.split(' ')
			: null;

		await updateFlagsAndRejectCookies({
			app,
			featuresFlags,
			automationMinNetValueFlags,
		});

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

		await app.portfolio.shouldHaveViewingWalletBanner('0x8af4...d4510');
	});

	test('It should show wallet address @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12848',
		});

		await app.portfolio.shouldHaveWalletAddress({ address: '0x8af4...d4510' });
	});

	test(`It should link to wallet's etherscan @regression`, async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12849',
		});

		await app.portfolio.shouldLinktoEtherscan('0x8af4f3fbc5446a3fc0474859b78fa5f4554d4510');
	});

	test('It should show "Positions" tab by default @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12751',
		});

		await app.portfolio.positions.featuredFor.shouldBeVisible();
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
