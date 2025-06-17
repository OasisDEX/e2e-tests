import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletSonicFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletSonic';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';

const test = testWithSynpress(withRealWalletSonicFixtures);

test.describe('With real wallet - Sonic USDC.E Position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await app.positionPage.open(
			'/earn/sonic/position/0x507a2d9e87dbd3076e65992049c41270b47964f8/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC.E',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should withdraw to USDC.E - (until rejecting "Withdraw" tx) - Sonic USDC.E position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC.E',
			withdrawnToken: 'USDC.E',
			withdrawAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '0.[1-2][0-9]{3}',
				sixMonthsAmount: '0.[1-2][0-9]{3}',
				oneYearAmount: '0.[1-2][0-9]{3}',
				threeYearsAmount: '0.[1-2][0-9]{3}',
			},
		});
	});
});
