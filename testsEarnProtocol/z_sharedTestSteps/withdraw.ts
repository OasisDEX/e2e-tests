import { expect } from '#earnProtocolFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

// Withdraw flow until rejecting final Withdraw tx
//    - NOTE: Token allowance must be set manually for tested vault and token
export const withdraw = async ({
	metamask,
	app,
	nominatedToken,
	withdrawnToken,
	withdrawAmount,
	estimatedEarnings,
	previewInfo,
}: {
	metamask: MetaMask;
	app: App;
	nominatedToken: EarnTokens;
	withdrawnToken: EarnTokens;
	withdrawAmount: string;
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
	if (nominatedToken != withdrawnToken) {
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken(withdrawnToken);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: withdrawnToken,
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);
	}

	await app.positionPage.sidebar.depositOrWithdraw(withdrawAmount);

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

	const sidebarButtonLocator = app.page.locator('[class*="_sidebarCta_"] button').first();

	await expect(
		sidebarButtonLocator,
		'[Agree], [Approve] or [Withdraw] buttons should be visible'
	).toContainText(/Agree|Approve|Withdraw/, { timeout: expectDefaultTimeout * 3 });

	let sidebarButtonLabel = await sidebarButtonLocator.innerText();

	// Sign T&C if needed
	if (sidebarButtonLabel.includes('Agree and sign')) {
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();

		await expect(
			sidebarButtonLocator,
			'[Approve] or [Withdraw] buttons should be visible'
		).toContainText(/Approve|Withdraw/, { timeout: expectDefaultTimeout * 3 });

		sidebarButtonLabel = await sidebarButtonLocator.innerText();
	}

	if (sidebarButtonLabel.includes('Approve')) {
		await app.positionPage.sidebar.approve(nominatedToken === 'ETH' ? 'WETH' : nominatedToken);
		await metamask.rejectTransaction();
	} else {
		await app.positionPage.sidebar.previewStep.shouldBeVisible({
			flow: 'withdraw',
			timeout: expectDefaultTimeout * 2,
		});

		const previewWithdrawnToken: EarnTokens =
			withdrawnToken == 'WSTETH'
				? 'wstETH'
				: withdrawnToken == 'USDC.E'
				? 'USDC.e'
				: withdrawnToken;

		await app.positionPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: withdrawAmount, token: previewWithdrawnToken },
			swap: previewInfo?.swap
				? {
						originalToken: withdrawnToken,
						originalTokenAmount: withdrawAmount,
						positionToken: nominatedToken,
						positionTokenAmount: previewInfo.swap.positionTokenAmount,
				  }
				: undefined,
			price: previewInfo?.price
				? {
						amount: previewInfo.price.amount,
						originalToken: previewWithdrawnToken,
						positionToken: nominatedToken,
				  }
				: undefined,
			priceImpact: previewInfo?.priceImpact,
			slippage: previewInfo?.slippage,
			transactionFee: previewInfo?.transactionFee,
		});

		await app.positionPage.sidebar.previewStep.withdraw();
		await metamask.rejectTransaction();
	}
};
