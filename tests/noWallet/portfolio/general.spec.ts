import { expect, test } from '@playwright/test';
import { App } from '../../../src/app';
import { updateFlagsAndRejectCookies } from 'utils/localStorage';

let app: App;

/*
	These tests will run on 'serial' mode to avoid spending
	DeBank API credits and save some text execution time.
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

		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F');
	});

	test.afterAll(async () => {
		await app.page.close();
	});

	test('It should toggle empty positions (net value below $0.01) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13027, 13031',
		});

		// Empty positions should be hidden by default
		await app.portfolio.positions.shouldHaveNetValuesGreaterThanOneCent();

		// Show empty positions
		await app.portfolio.positions.showEmptyPositions();
		await app.portfolio.positions.shouldHaveNetValuesGreaterAndLowerThanOneCent();

		// Hide empty positions
		await app.portfolio.positions.showEmptyPositions();
		await app.portfolio.positions.shouldHaveNetValuesGreaterThanOneCent();
	});

	test('It should sort by Net Value @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13032, 13033',
		});

		let firstPositionNetValue: number;
		let fourthPositionNetValue: number;

		// Positions should be sorted by High-to-Low Net Value by default
		await app.portfolio.positions.shouldHaveSortByLable('Sort by');
		firstPositionNetValue = await app.portfolio.positions.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positions.getNthNetValue(4);
		expect(firstPositionNetValue).toBeGreaterThan(fourthPositionNetValue);

		// Sort by Low-to-High Net Value
		await app.portfolio.positions.sortByNetValue('Low to High');
		await app.portfolio.positions.shouldHaveSortByLable('Net Value');
		firstPositionNetValue = await app.portfolio.positions.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positions.getNthNetValue(4);
		expect(firstPositionNetValue).toBeLessThan(fourthPositionNetValue);

		// Sort by High-to-Low Net Value
		await app.portfolio.positions.sortByNetValue('High to Low');
		await app.portfolio.positions.shouldHaveSortByLable('Net Value');
		firstPositionNetValue = await app.portfolio.positions.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positions.getNthNetValue(4);
		expect(firstPositionNetValue).toBeGreaterThan(fourthPositionNetValue);
	});
});
