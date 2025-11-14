import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expect } from '#earnProtocolFixtures';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletArbitrumFixtures);

test.describe('Real wallet - Portfolio - Migrate', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await expect(async () => {
			await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F');
			await app.waitForAppToBeStable();
		}).toPass();
	});

	test('It should show available to migrate amount @regression', async ({ app }) => {
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
				apyDiff: '([\\+,\\-])?[0-9]{1,2}.[0-9]{2}%',
			},
		]);
	});

	test('It should open "Migrate" page', async ({ app }) => {
		await app.portfolio.overview.selectFirstMigratablePosition();
		await app.portfolio.overview.migrate({ button: 'bottom' });

		await app.migratePage.shouldBeVisible();
	});

	test('It should migrate position - Until first tx', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.portfolio.overview.migrate({ button: 'top' });
		await app.migratePage.shouldBeVisible();

		await app.migratePage.selectPositionToMigrateByListOrder(1);

		await app.migratePage.selectVaulToMigrateToByNetworkAndListOrder({
			network: 'arbitrum',
			nth: 1,
		});

		await app.migratePage.migrate();

		await app.positionPage.sidebar.migrate.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });

		await app.positionPage.sidebar.migrate.switchNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.migrate.approve();
		await metamask.rejectTransaction();
	});
});
