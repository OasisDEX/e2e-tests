import { test } from '#earnProtocolFixtures';

test.describe('Porfolio - Wallet tab', async () => {
	test.beforeEach(async ({ app }) => {
		await app.portfolio.wallet.openPage('0x10649c79428d718621821Cf6299e91920284743F');
	});

	test('It should show total wallet value', async ({ app }) => {
		await app.portfolio.wallet.shouldHaveTotalValue('[0-9]{1,2}.[0-9]{2}');
	});

	// test('It should display top 3 assets', async ({ app }) => {
	// 	await app.portfolio.wallet;
	// });
});
