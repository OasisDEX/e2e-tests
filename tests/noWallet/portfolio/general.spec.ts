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

		const featuresFlags = process.env.FLAGS_FEATURES ? process.env.FLAGS_FEATURES.split(' ') : null;
		const automationMinNetValueFlags = process.env.FLAGS_AUTOMATION_MIN_NET_VALUE
			? process.env.FLAGS_AUTOMATION_MIN_NET_VALUE.split(' ')
			: null;

		await updateFlagsAndRejectCookies({
			app,
			featuresFlags,
			automationMinNetValueFlags,
		});

		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });
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
		await app.portfolio.positionsHub.shouldHaveNetValuesGreaterThanOneCent();

		// Show empty positions
		await app.portfolio.positionsHub.showEmptyPositions();
		await app.portfolio.positionsHub.shouldHaveNetValuesGreaterAndLowerThanOneCent();

		// Hide empty positions
		await app.portfolio.positionsHub.showEmptyPositions();
		await app.portfolio.positionsHub.shouldHaveNetValuesGreaterThanOneCent();
	});

	test('It should list migratable positions @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		const { migratePositionsCount } = await app.portfolio.positionsHub.getNumberOfPositions();
		expect(migratePositionsCount).toEqual(1);
	});

	test('It should filter by migratable positions @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		const positionsCount = await app.portfolio.positionsHub.getNumberOfPositions();
		expect(positionsCount.migratePositionsCount).toEqual(1);
		expect(positionsCount.positionsListedCount).toBeGreaterThan(1);

		await app.portfolio.positionsHub.filterByProductType({
			currentFilter: 'All products',
			productType: 'Migrate',
		});

		const positionsCount2 = await app.portfolio.positionsHub.getNumberOfPositions();
		expect(positionsCount2.migratePositionsCount).toEqual(1);
		expect(positionsCount2.positionsListedCount).toEqual(0);
	});

	test('It should open position page with Migrate UI - Position card @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.portfolio.positionsHub.openNthPosition(0, { migratable: true });

		await app.position.manage.shouldBeVisible('Migrate your position into Summer.fi');
	});

	test('It should open position page with Migrate UI - Overview Migrate link @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });

		await app.portfolio.positionsHub.openNthPosition(0, { migratable: true });

		await app.position.manage.shouldBeVisible('Migrate your position into Summer.fi');
	});

	test.skip('It should sort by Net Value', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '13032, 13033',
			},
			{
				type: 'Bug',
				description: '13770',
			}
		);

		let firstPositionNetValue: number;
		let fourthPositionNetValue: number;

		// Positions should be sorted by High-to-Low Net Value by default
		await app.portfolio.positionsHub.shouldHaveSortByLable('Sort by');
		firstPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(4);
		expect(firstPositionNetValue).toBeGreaterThan(fourthPositionNetValue);

		// Sort by Low-to-High Net Value
		await app.portfolio.positionsHub.sortByNetValue('Low to High');
		await app.portfolio.positionsHub.shouldHaveSortByLable('Net Value');
		firstPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(4);
		expect(firstPositionNetValue).toBeLessThan(fourthPositionNetValue);

		// Sort by High-to-Low Net Value
		await app.portfolio.positionsHub.sortByNetValue('High to Low');
		await app.portfolio.positionsHub.shouldHaveSortByLable('Net Value');
		firstPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(1);
		fourthPositionNetValue = await app.portfolio.positionsHub.getNthNetValue(4);
		expect(firstPositionNetValue).toBeGreaterThan(fourthPositionNetValue);
	});
});
