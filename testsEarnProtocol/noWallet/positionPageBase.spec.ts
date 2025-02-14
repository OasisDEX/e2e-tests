import { test } from '#earnProtocolFixtures';

test.describe('Position page - Base - Specific user page', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.positionPage.open(
			'/earn/base/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F'
		);
	});

	test('It should show Market value, Earned, Net Contribution and Current APY info', async ({
		app,
	}) => {
		await app.positionPage.shouldHaveMarketValue({
			token: 'USDC',
			amount: '[0-9].[0-9]{3,4}',
		});

		await app.positionPage.shouldHaveEarned({
			token: 'USDC',
			amount: '[0-9].[0-9]{3,4}',
		});

		await app.positionPage.shouldHaveNetContribution({
			token: 'USDC',
			amount: '[0-9].[0-9]{3,4}',
			numberOfDeposits: '[0-9]{1,2}',
		});

		await app.positionPage.shouldHaveCurrentApy('[0-9]{1,2}.[0-9]{2}');
	});
});
