import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Staking page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.staking.openPage();
	});

	test('It should open log in popup - Total SUMR staked', async ({ app }) => {
		// Wait for component to fully load to avoid random fails
		await app.staking.shouldHaveTotalSumrStaked({
			sumrAmount: '[0-9]{2,3}.[0-9]{2}M',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.connectWallet('Total SUMR staked');
		await app.modals.logIn.shouldBeVisible();
	});

	test('It should open log in popup - Avg SUMR lock period', async ({ app }) => {
		// Wait for component to fully load to avoid random fails
		await app.staking.shouldHaveAvgSumrLockPeriod({
			days: '[0-9]{2,4}',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.connectWallet('Avg SUMR lock period');
		await app.modals.logIn.shouldBeVisible();
	});

	// SKIP - UI in progress
	test.skip('It should show yield sources', async ({ app }) => {
		await app.staking.shouldHaveYieldSource1({
			percentage: '[0-9]{2,5}.[0-9]{2}',
			perYear: '0.00',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.shouldHaveYieldSource2({
			percentage: '[0-9]{2,15}.[0-9]{2}',
			sumrPerYear: '0.00',
			usdPerYear: '0.00',
		});
	});

	test('It should show Annualized Revenue and Share paid to Stakers @regression', async ({
		app,
	}) => {
		await app.staking.shouldHaveAnnualizedRevenue({
			usdAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
			sumrTvl: '[0-9]{2,3}.[0-9]{2}M',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.shouldHaveSharePaidToStakers({
			usdAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
			timeout: expectDefaultTimeout * 3,
		});
	});
});
