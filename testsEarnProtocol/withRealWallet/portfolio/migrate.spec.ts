import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';
import { expect } from '#earnProtocolFixtures';
import { addNetwork } from 'utils/synpress/commonWalletSetup';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Real wallet - Portfolio - Migrate', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 45_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await expect(async () => {
			await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F');
			await app.waitForAppToBeStable();
		}).toPass();
	});

	test('It should show available to migrate amount', async ({ app }) => {
		await app.portfolio.overview.shouldHaveAvailableToMigrateAmount('0.5[0-9]{2}');
	});

	test('It should list available to migrate positions', async ({ app }) => {
		await app.portfolio.overview.shouldHaveAvailableToMigratePositions([
			{
				protocol: 'aave',
				network: 'arbitrum',
				depositToken: 'USDC',
				current7dApy: '[0-9]{1,2}.[0-9]{2}%',
				summer7dApy: '[0-9]{1,2}.[0-9]{2}%',
				apyDiff: '[\\+,\\-][0-9]{1,2}.[0-9]{2}%',
			},
		]);
	});
});
