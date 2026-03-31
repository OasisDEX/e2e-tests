import { test } from '#earnProtocolFixtures';

test.describe('Position page - Mainnet ETH HR @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await app.positionPage.open(
			'/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10/0x10649c79428d718621821Cf6299e91920284743F',
		);
	});

	test('It should not have WSTETH Rewards', async ({ app }) => {
		await app.positionPage.shouldNotHaveWstethRewards();
	});
});
