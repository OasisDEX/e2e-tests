import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('Staking > Manage page', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.staking.manage.openPage();
	});

	test('It should stake SUMR - No lockup - Until tx approval', async ({ app, metamask }) => {
		await app.staking.manage.sumrAmountToStake('10');
		await app.staking.manage.approveSumr();

		await metamask.rejectTransaction();
	});

	test('It should stake SUMR - <3m locup slot - Until tx approval', async ({ app, metamask }) => {
		await app.staking.manage.sumrAmountToStake('10');
		await app.staking.manage.selectLockupDays(60);

		await app.staking.manage.acceptPenaltyWarning();
		await app.staking.manage.approveSumr();
		await metamask.rejectTransaction();
	});
});
