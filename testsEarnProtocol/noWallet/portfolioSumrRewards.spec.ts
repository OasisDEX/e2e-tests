import { test } from '#earnProtocolFixtures';

test.describe('Portfolio > SUMR Rewards tab', async () => {
	test.beforeEach(async ({ app }) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F');
	});

	test('It should disply SUMR price', async ({ app }) => {
		// await app.portfolio.rewards.
	});
});
