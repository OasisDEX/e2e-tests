import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import {
	expectDefaultTimeout,
	extremelyLongTestTimeout,
	longTestTimeout,
	veryLongTestTimeout,
} from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Base ETH Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 80 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x2bb9ad69feba5547b7cd57aafe8457d40bf834af/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Base ETH position page', async ({
		app,
	}) => {
		// ETH
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('0.0005');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			amount: '0.000[4-5]',
		});

		// CBETH
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('CBETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'CBETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			amount: '[0-9]{1,2}.[0-9]{2}',
		});

		// USDS
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('USDS');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '1.[0-9]{4}',
			token: 'USDS',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('1');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			amount: '0.000[0-9]',
		});
	});

	test('It should deposit ETH & USDS - (until rejecting "Deposit" tx) - Base ETH position page', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// === ETH ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'ETH',
			depositAmount: '0.0005',
			estimatedEarnings: {
				thirtyDaysAmount: '0.001[0-9]',
				sixMonthsAmount: '0.001[0-9]',
				oneYearAmount: '0.001[0-9]',
				threeYearsAmount: '0.001[0-9]',
			},
			previewInfo: { transactionFee: '[0-2].[0-9]{2}' },
		});

		// === USDS ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'USDS',
			depositAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.0[0-9]{3}',
			},
			previewInfo: {
				swap: {
					positionTokenAmount: '0.000[0-9]',
				},
				price: { amount: '0.000[0-9]' },
				// priceImpact: '[0-3].[0-9]{2}',
				slippage: '0.10',
				transactionFee: '[0-2].[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Base ETH Position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x2bb9ad69feba5547b7cd57aafe8457d40bf834af/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.[0-9]{4}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show ETH deposited balance amount to be withdrawn when selecting ETH - Base ETH position page', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.positionPage.sidebar.depositOrWithdraw('0.0005');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.0005',
			tokenOrCurrency: 'ETH',
		});
	});

	test('It should withdraw to ETH - (until rejecting "Withdraw" tx) - Base ETH position page', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await withdraw({
			metamask,
			app,
			nominatedToken: 'ETH',
			withdrawnToken: 'ETH',
			withdrawAmount: '0.0004',
			estimatedEarnings: {
				thirtyDaysAmount: '0.000[0-9]',
				sixMonthsAmount: '0.000[0-9]',
				oneYearAmount: '0.000[0-9]',
				threeYearsAmount: '0.000[0-9]',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Base ETH position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x2bb9ad69feba5547b7cd57aafe8457d40bf834af/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.[0-9]{4}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Base ETH position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'base',
			token: 'ETH',
			risk: 'Lower Risk',
			balance: '0.00[0-9]',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			{
				network: 'base',
				token: 'USDC',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'base',
				token: 'EURC',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Base ETH position @regression', async ({ app, metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		// EURC
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'EURC',
		});

		// USDC
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
		});
	});
});
