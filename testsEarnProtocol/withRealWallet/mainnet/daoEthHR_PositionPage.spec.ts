import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';
import { expect } from '#earnProtocolFixtures';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - DAO Mainnet ETH Higher Risk position page - APY tag', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821cf6299e91920284743f',
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should have tooltip with APY details and match Net APY tag', async ({ app }) => {
		// Get Net APY in tag
		await app.vaultPage.shouldHaveNetApyTag();
		const tagNetApy: string = await app.vaultPage.getTagNetApy();

		await app.vaultPage.openNetApyTooltip();
		await app.tooltips.netApy.shouldBeVisible();

		await app.tooltips.netApy.shouldHave({
			liveNativeApy: '[0-9]{1,2}.[0-9]{2}',
			sumrRewards: '[0-9]{1,2}.[0-9]{2}',
			wstethRewards: '[0-9]{1,2}.[0-9]{2}',
			managementFee: '0.30',
			netApy: '[0-9]{1,2}.[0-9]{2}',
		});

		// Get Net APY in tag tooltip
		const tooltipDetails = await app.tooltips.netApy.getDetails({ withWstethRewards: true });
		// Verify that tag and tooltip Net APY match
		expect(
			tagNetApy,
			`Card Net APY(${tagNetApy}) should equal Card Tooltip Net APY (${tooltipDetails.netApy})`,
		).toEqual(tooltipDetails.netApy);

		// Verify that tooltip Net APY equals tooltip Native Live APY + SUMR rewards - Management Fee
		expect(
			parseFloat(tooltipDetails.liveNativeApy) +
				parseFloat(tooltipDetails.sumrRewards) +
				parseFloat(tooltipDetails.wstethRewards) -
				parseFloat(tooltipDetails.managementFee),
			`Native APY (${tooltipDetails.liveNativeApy}) + WSTETH (${tooltipDetails.wstethRewards}) + SUMR (${tooltipDetails.sumrRewards}) - Fee (${tooltipDetails.managementFee}) should be very close to Net APY (${tooltipDetails.netApy})`,
		).toBeCloseTo(parseFloat(tooltipDetails.netApy), 1);
	});
});

test.describe('With real wallet - DAO Mainnet ETH Higher Risk position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821cf6299e91920284743f',
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show Deposit balances and Deposit amounts - DAO Mainnet ETH Higher Risk position', async ({
		app,
	}) => {
		// === ETH ===
		await app.positionPage.sidebar.depositOrWithdraw('0.5');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			// amount: '0.5000', --> Issue with 1Inch - Fix not prioritised
			amount: '0.[4-5][0-9]{3}',
		});

		// === USDC ===
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('USDC');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '2.[0-9]{4}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			amount: '0.000[0-9]',
		});

		// === WETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('WETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'WETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '([0-9],)?[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit ETH, WETH & USDC (until rejecting "Deposit" tx) - DAO Mainnet ETH Higher Risk position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === ETH ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'ETH',
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

		// === USDC ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'USDC',
			depositAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				swap: {
					positionTokenAmount: '0.000[0-9]',
				},
				price: { amount: '0.000[0-9]' },
				// priceImpact: '[0-3].[0-9]{2}',
				slippage: '0.10',
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - DAO Mainnet ETH Higher Risk position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821cf6299e91920284743f',
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

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum ETH balance amount to be withdrawn in ETH - DAO ETH Mainnet Higher Risk position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.0001');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '<0.001',
			tokenOrCurrency: 'ETH',
		});
	});

	test('It should withdraw to ETH - (until rejecting "Withdraw" tx) - DAO Mainnet ETH Higher Risk position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'ETH',
			withdrawnToken: 'ETH',
			withdrawAmount: '0.0001',
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

test.describe('With real wallet - DAO Mainnet ETH Higher Risk position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821cf6299e91920284743f',
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

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Mainnet ETH Higher Risk position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'ethereum',
			token: 'ETH',
			riskLevel: 'Higher Risk',
			riskManagementType: 'DAO Risk-Managed',
			balance: '0.000[0-9]',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			// SKIP - Wrong "30d APY" in staging
			// {
			// 	network: 'ethereum',
			// 	token: 'USDC',
			// 	riskLevel: 'Higher Risk',
			// 	riskManagementType: 'DAO Risk-Managed',
			// 	thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	liveAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	apySpread: '[0-9]{1,2}.[0-9]{2}',
			// },
			{
				network: 'ethereum',
				token: 'USDC',
				riskLevel: 'Lower Risk',
				riskManagementType: 'Risk-Managed by BlockAnalitica',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			// SKIP - Wrong "30d APY" in staging
			// {
			// 	network: 'ethereum',
			// 	token: 'USDC',
			// 	riskLevel: 'Higher Risk',
			// 	riskManagementType: 'Risk-Managed by BlockAnalitica',
			// 	thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	liveAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	apySpread: '[0-9]{1,2}.[0-9]{2}',
			// },
			// SKIP - Wrong "30d APY" in staging
			// {
			// 	network: 'ethereum',
			// 	token: 'USDT',
			// 	riskLevel: 'Lower Risk',
			// 	riskManagementType: 'Risk-Managed by BlockAnalitica',
			// 	thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	liveAPY: '[0-9]{1,2}.[0-9]{2}',
			// 	apySpread: '[0-9]{1,2}.[0-9]{2}',
			// },
			{
				network: 'ethereum',
				token: 'ETH',
				riskLevel: 'Lower Risk',
				riskManagementType: 'Risk-Managed by BlockAnalitica',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'ethereum',
				token: 'ETH',
				riskLevel: 'Higher Risk',
				riskManagementType: 'Risk-Managed by BlockAnalitica',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch DAO Mainnet ETH Higher Risk position', async ({ app, metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		// USDC Lower risk
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			riskLevel: 'Lower Risk',
		});

		// USDC Higher risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			riskLevel: 'Higher Risk',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
		});

		// USDT
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDT',
		});

		// ETH Lower Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'ETH',
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

		// USDC Higher risk - DAO
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			riskLevel: 'Higher Risk',
			riskManagementType: 'DAO Risk-Managed',
		});
	});
});

test.describe('With real wallet - DAO Mainnet ETH Higher Risk position page - Claim WSTETH Rewards', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x0c1fbccc019320032d9acd193447560c8c632114/0x10649c79428d718621821cf6299e91920284743f',
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

	test('It should claim WSTETH Rewards - Until rejecting 1st tx @regression', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.positionPage.shouldHaveWstethRewards({
			wstethAmount: '<0.001',
			usdAmount: '0.[0-9]{2}',
		});

		await app.earn.sidebar.claimWsteth();
		await app.page.waitForTimeout(500); // To avoid random fails
		await metamask.rejectTransaction();
	});
});
