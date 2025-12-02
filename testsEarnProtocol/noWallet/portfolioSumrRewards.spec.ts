import { test } from '#earnProtocolFixtures';

test.describe('Portfolio > SUMR Rewards tab', async () => {
	test.beforeEach(async ({ app }) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F?tab=rewards');
	});

	// SKIP -- Section now removed
	test.skip('It should display SUMR price', async ({ app }) => {
		await app.portfolio.rewards.shoulHaveSumrPrice({
			price: '[0-9].[0-9]{2,4}',
			marketCap: '([0-9]{1,3},)?([0-9]{1,3},)?([0-9]{1,3},)?[0-9]{1,3}',
			valuation: '([0-9]{1,3},)?([0-9]{1,3},)?([0-9]{1,3},)?[0-9]{1,3}',
			holders: '([0-9]{1,3},)?[0-9]{1,3}',
			sevenDaysTrend: '[0-9]{1,3}.[0-9]{2}',
			thirtyDaysTrend: '[0-9]{1,3}.[0-9]{2}',
			ninetyDaysTrend: '[0-9]{1,3}.[0-9]{2}',
		});
	});

	// SKIP -- Button now removed
	test.skip('It should buy SUMR', async ({ app }) => {
		await app.portfolio.rewards.buySumr();

		// TO BE DONE
		// -- Redirects to non-existent page for now
	});
});
