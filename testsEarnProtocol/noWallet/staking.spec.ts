import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Staking page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.staking.openPage();
	});

	test('It should redirect to /staking/manage page', async ({ app }) => {
		// Wait for component to fully load toavoid random fails
		await app.staking.shouldHaveSumrInWallet({
			sumrAmount: '-',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.stakeYourSumr();

		await app.staking.manage.shouldBeVisible();
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

	test('It should show Annualized Revenue and Share paid to Stakers', async ({ app }) => {
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
