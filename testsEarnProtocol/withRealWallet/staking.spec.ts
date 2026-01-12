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
		// Wait for component to fully load toavoid random fails
		await app.staking.shouldHaveSumrInWallet({
			sumrAmount: '[0-9]',
			timeout: expectDefaultTimeout * 3,
		});

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
			sumrAmount: '[0-9]{1,3}.[0-9]{2}',
			usdAmount: '[0-9]{1,3}.[0-9]{2}',
		});
	});

	test('It should unstake position - Until cancelling tx @regression', async ({
		app,
		metamask,
	}) => {
		await app.staking.removeStakingPosition({
			sumrStaked: '20.00',
			lockPeriod: '18 days',
		});

		await app.staking.removeStake.approve();

		await metamask.rejectTokenPermission();
	});
});
