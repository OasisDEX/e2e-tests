import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Staking page', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.staking.openPage();
	});

	test('It should redirect to /staking/manage page', async ({ app }) => {
		await app.staking.stakeYourSumr();

		await app.staking.manage.shouldBeVisible();
	});

	test('It should show SUMR in wallet and SUMR to claim', async ({ app }) => {
		await app.staking.shouldHaveSumrInWallet({
			sumrAmount: '[0-9]{2,3}.[0-9]{2}',
			usdAmount: '[0-9]{2,3}.[0-9]{2}',
			timeout: expectDefaultTimeout * 3,
		});

		await app.staking.shouldHaveSumrToClaim({
			sumrAmount: '[0-9]{1,2}.[0-9]{2}',
			usdAmount: '[0-9]{1,2}.[0-9]{2}',
		});
	});
});
