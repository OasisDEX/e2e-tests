import { expect } from '#earnProtocolFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

// Deposit flow until rejecting final Deposit tx
//    - NOTE: Token allowance must be set manually for tested vault and token
export const deposit = async ({
	metamask,
	app,
	nominatedToken,
	depositedToken,
	depositAmount,
	estimatedEarnings,
	previewInfo,
}: {
	metamask: MetaMask;
	app: App;
	nominatedToken: EarnTokens;
	depositedToken: EarnTokens;
	depositAmount: string;
	estimatedEarnings?: {
		thirtyDaysAmount: string;
		sixMonthsAmount: string;
		oneYearAmount: string;
		threeYearsAmount: string;
	};
	previewInfo?: {
		swap?: {
			positionTokenAmount: string;
		};
		price?: {
			amount: string;
		};
		priceImpact?: string;
		slippage?: string;
		transactionFee?: string;
	};
}) => {
	if (nominatedToken != depositedToken) {
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken(depositedToken);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: depositedToken,
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);
	}

	await app.positionPage.sidebar.depositOrWithdraw(depositAmount);

	await app.positionPage.sidebar.shouldHaveEstimatedEarnings(
		[
			{
				time: 'After 30 days',
				amount: estimatedEarnings?.thirtyDaysAmount,
				token: nominatedToken,
			},
			{
				time: '6 months',
				amount: estimatedEarnings?.sixMonthsAmount,
				token: nominatedToken,
			},
			{
				time: '1 year',
				amount: estimatedEarnings?.oneYearAmount,
				token: nominatedToken,
			},
			{
				time: '3 years',
				amount: estimatedEarnings?.threeYearsAmount,
				token: nominatedToken,
			},
		],
		{ timeout: expectDefaultTimeout * 2 }
	);
	await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
	await app.positionPage.sidebar.preview();

	// Sign T&C if needed
	let agreeIsVisible: boolean = false;
	await expect(async () => {
		agreeIsVisible = await app.page
			.locator('[class*="_sidebarCta_"]')
			.getByRole('button', { name: 'Agree and sign' })
			.isVisible();
		const depositIsVisible = await app.page
			.locator('[class*="_sidebarCta_"]')
			.getByRole('button', { name: 'Deposit' })
			.isVisible();

		expect(agreeIsVisible || depositIsVisible).toBeTruthy();
	}).toPass();

	if (agreeIsVisible) {
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();
	}

	await app.positionPage.sidebar.previewStep.shouldBeVisible({
		flow: 'deposit',
		timeout: expectDefaultTimeout * 2,
	});

	const previewDepositedToken: EarnTokens =
		depositedToken == 'WSTETH' ? 'wstETH' : depositedToken == 'USDC.E' ? 'USDC.e' : depositedToken;

	await app.positionPage.sidebar.previewStep.shouldHave({
		depositAmount: { amount: depositAmount, token: previewDepositedToken },
		swap: previewInfo?.swap
			? {
					originalToken: depositedToken,
					originalTokenAmount: depositAmount,
					positionToken: nominatedToken,
					positionTokenAmount: previewInfo.swap.positionTokenAmount,
			  }
			: undefined,
		price: previewInfo?.price
			? {
					amount: previewInfo.price.amount,
					originalToken: previewDepositedToken,
					positionToken: nominatedToken,
			  }
			: undefined,
		priceImpact: previewInfo?.priceImpact,
		slippage: previewInfo?.slippage,
		transactionFee: previewInfo?.transactionFee,
	});

	await app.positionPage.sidebar.previewStep.deposit();
	await metamask.rejectTransaction();
};
