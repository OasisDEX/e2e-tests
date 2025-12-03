import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Staking page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.staking.openPage();
	});

	test('It should redirect to /staking/manage page', async ({ app }) => {
		await app.staking.stakeYourSumr();

		await app.staking.manage.shouldBeVisible();
	});

	test('It should show SUMR in wallet and SUMR to claim', async ({ app }) => {
		await app.staking.shouldHaveSumrInWallet({
			sumrAmount: '[0-9]{1,2}.[0-9]{2}',
			usdAmount: '[0-9]{1,2}.[0-9]{2}',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.shouldHaveSumrToClaim({
			sumrAmount: '[0-9]{1,2}.[0-9]{2}',
			usdAmount: '[0-9]{1,2}.[0-9]{2}',
		});
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
});
