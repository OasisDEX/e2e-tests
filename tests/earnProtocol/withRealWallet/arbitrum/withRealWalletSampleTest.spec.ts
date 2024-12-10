import { testWithSynpress } from '@synthetixio/synpress';
import { test as withWalletArbitrumFixtures } from '../../../../srcEarnProtocol/fixtures/withTestWalletArbitrum';

const test = testWithSynpress(withWalletArbitrumFixtures);

const { expect } = test;

test.describe('With reaal wallet - Arbitrum', async () => {
	test('It should show USDC balance in Arbitrum USDC position', async ({ app }) => {
		await app.page.goto('/earn/arbitrum/position/usdc-ya-later');

		//
		await app.pause();
		//

		// TODO
	});
});
