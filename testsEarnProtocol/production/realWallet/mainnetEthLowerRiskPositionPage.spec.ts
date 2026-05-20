import { testWithSynpress } from '@synthetixio/synpress';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';
import { expectDefaultTimeout, extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - ETH Mainnet Lower Risk position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x67e536797570b3d8919df052484273815a0ab506/0x10649c79428d718621821cf6299e91920284743f',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();
	});

	test('It should deposit USDC & WETH - (until rejecting "Deposit" tx) - Mainnet ETH Lower Risk position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		// === USDC ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'USDC',
			depositAmount: '8',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				withSwap: {
					positionTokenAmount: '0.0[0-9]{3}',
					limitPrice: '0.000[0-9]{1,3}',
					slippage: '0.1',
					quoteValidUntil: '[0-9]{1,2}:[0-9]{2}',
				},
			},
		});

		// === WETH ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'WETH',
			depositAmount: '0.001',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});

	test('It should switch Mainnet ETH Lower Risk position', async ({ app, metamask }) => {
		test.setTimeout(veryLongTestTimeout);

		await app.positionPage.sidebar.selectTab('Switch');

		// USDC Lower Risk
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			riskLevel: 'Lower Risk',
		});

		// ETH Higher Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'ETH',
			riskLevel: 'Higher Risk',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
		});
	});
});
