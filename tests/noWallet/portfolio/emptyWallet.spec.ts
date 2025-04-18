import { test } from '@playwright/test';
import { App } from '../../../src/app';
import { updateFlagsAndRejectCookies } from 'utils/localStorage';

let app: App;

/*
	These 'Empty wallet' tests will run on 'serial' mode to 
	avoid spending DeBank API credits and save some text execution time.
*/
test.describe.configure({ mode: 'serial' });

test.describe('Empty wallet - Wallet not connected', async () => {
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

	test('It should show no positions in Positions tab @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13023',
		});

		await app.portfolio.positionsHub.shouldNotHavePositions();
	});

	test('It should show no assets in Wallet tab @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12750',
		});

		await app.portfolio.open('0x5d3C01544Ea51619413dfad78fF4ac81e0294074#wallet');
		await app.portfolio.wallet.shouldNotHaveAssets();
	});

	test('It should show "0.00" for all headline fields @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12837',
		});

		await app.portfolio.shouldHaveTotalValue('$0.00');
		await app.portfolio.shouldHaveSummerfiPortfolio('$0.00');
		await app.portfolio.shouldHaveTotalSupplied('$0.00');
		await app.portfolio.shouldHaveTotalBorrowed('$0.00');
	});
});
