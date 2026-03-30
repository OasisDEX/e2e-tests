import { test } from '#earnProtocolFixtures';

test.describe('Position page - Base - Specific user page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821Cf6299e91920284743F',
		);
	});

	test('It should show Market value, Earned, Net Contribution, # of Deposits APYs and Instant liquidity info', async ({
		app,
	}) => {
		await app.positionPage.shouldHaveMarketValue({
			token: 'ETH',
			amount: '0.000[0-9]',
			usdAmount: '[0-3].[0-9]{2,4}',
		});

		await app.positionPage.shouldHaveEarned({
			token: 'ETH',
			amount: '0.0[0-9]{1,3}',
			usdAmount: '(<)?0.[0-9]{2}',
		});

		await app.positionPage.shouldHaveNetContribution({
			token: 'ETH',
			amount: '0.000[3-6]',
			numberOfDeposits: '[0-9]{1,2}',
		});

		await app.positionPage.shouldHaveNumberOfDeposits();

		await app.positionPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');
	});

	test('It should have WSTETH Rewards', async ({ app }) => {
		await app.positionPage.shouldHaveWstethRewards({
			wstethAmount: '<0.001',
			usdAmount: '0.[0-9]{2}',
		});
	});
});
