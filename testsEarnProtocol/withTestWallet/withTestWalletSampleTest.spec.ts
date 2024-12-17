import { testWithSynpress } from '@synthetixio/synpress';
import { test as withWalletArbitrumFixtures } from '../../srcEarnProtocol/fixtures/withTestWalletArbitrum';

const test = testWithSynpress(withWalletArbitrumFixtures);

const { expect } = test;

test.describe(`With wallet sample test`, async () => {
	test.beforeEach(async ({ app }) => {
		await app.earn.openPage();
	});

	test('probando', async ({ app }) => {
		console.log('START TEST');
		// await app.pause();
	});
});
