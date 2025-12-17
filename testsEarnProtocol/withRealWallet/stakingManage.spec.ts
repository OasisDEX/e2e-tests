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

	// It randomly fails since 'no lockup' slot becomes full
	test('It should stake SUMR - No lockup - Until tx approval', async ({ app, metamask }) => {
		// Wait for staking module to fully load
		await app.staking.manage.shouldHaveBalance({
			balance: '[0-9]',
			timeout: expectDefaultTimeout * 2,
		});

		await app.staking.manage.sumrAmountToStake('0.1');

		await app.staking.manage.approveSumr();

		await metamask.rejectTransaction();
	});

	// It randomly fails since '<3m' slot becomes full
	test('It should stake SUMR - <3m lockup slot - Until tx approval', async ({ app, metamask }) => {
		// Wait for staking module to fully load
		await app.staking.manage.shouldHaveBalance({
			balance: '[0-9]',
			timeout: expectDefaultTimeout * 2,
		});

		await app.staking.manage.sumrAmountToStake('0.1');
		await app.staking.manage.selectLockupDays(60);

		await app.staking.manage.acceptPenaltyWarning();
		await app.staking.manage.approveSumr();
		await metamask.rejectTransaction();
	});

	test('It should stake SUMR - MAX lockup slot - Until tx approval', async ({ app, metamask }) => {
		// Wait for staking module to fully load
		await app.staking.manage.shouldHaveBalance({
			balance: '[0-9]',
			timeout: expectDefaultTimeout * 2,
		});

		await app.staking.manage.sumrAmountToStake('0.1');
		await app.staking.manage.shouldUpdateYieldBoostMultiplier({ oldValue: '-' });

		const ybmAfterAmountToStake = await app.staking.manage.getYieldBoostMultiplier();

		await app.staking.manage.selectLockupDays(1095);
		await app.staking.manage.shouldUpdateYieldBoostMultiplier({ oldValue: ybmAfterAmountToStake });

		await app.staking.manage.acceptPenaltyWarning();
		await app.staking.manage.shouldHaveApproveSumrButtonEnabled();

		await app.staking.manage.approveSumr();
		await metamask.rejectTransaction();
	});
});
