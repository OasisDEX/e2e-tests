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

	test('It should show no positions in Positions tab @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13023',
		});

		await app.portfolio.positions.shouldNotHavePositions();
	});

	test('It should show no assets in Wallet tab @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12750',
		});

		await app.portfolio.open('0x8Af4F3fbC5446a3fc0474859B78fA5f4554D4510#wallet');
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
