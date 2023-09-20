import { test } from '#noWalletFixtures';

test.describe('Portfolio', async () => {
	test.skip('It should show no assets', async ({ app }) => {
		await app.portfolio.open('0x8Af4F3fbC5446a3fc0474859B78fA5f4554D4510');

		// TO DO
	});
});
