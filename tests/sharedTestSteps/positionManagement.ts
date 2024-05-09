import { expect, test } from '@playwright/test';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { longTestTimeout, positionTimeout } from 'utils/config';
import { Reason } from 'src/pages/position/swap';

type ActionData = { token: string; amount: string };

/**
 *
 * @param adjustRisk should be between '0' and '1' both included | 0: far left in slider | 1: far right
 */
export const openPosition = async ({
	app,
	forkId,
	deposit,
	borrow,
	existingDPM,
	adjustRisk,
	protocol,
}: {
	app: App;
	forkId: string;
	deposit: ActionData;
	borrow?: ActionData;
	existingDPM?: boolean;
	adjustRisk?: { positionType?: 'Borrow'; value: number };
	protocol?: 'Ajna' | 'Morpho Blue';
}) => {
	await app.position.setup.deposit(deposit);
	if (borrow) {
		await app.position.setup.borrow(borrow);
	}
	if (adjustRisk) {
		if (adjustRisk?.positionType) {
			await app.position.setup.moveSlider({ withWallet: true, value: adjustRisk.value });
		} else {
			await app.position.setup.moveSliderOmni({ value: adjustRisk.value });
		}
	}
	if (!existingDPM) {
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	if (deposit.token !== 'ETH') {
		if (existingDPM) {
			await app.position.setup.setTokenAllowance(deposit.token);
		}

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowance();
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmAddToken', forkId });
	}).toPass({ timeout: longTestTimeout });

	if (protocol) {
		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines
		await app.page.reload();
		await app.position.setup.goToPosition();
		await app.position.overview.shouldBeVisible();
	} else {
		await app.position.setup.goToPositionShouldBeVisible();
		const positionId: string = await app.position.setup.getNewPositionId();
		//
		await app.page.waitForTimeout(10_000);
		//
		await expect(async () => {
			await app.page.goto(positionId);
			await app.position.overview.shouldBeVisible();
		}).toPass();

		return positionId;
	}
};

export const openMakerPosition = async ({
	app,
	forkId,
	deposit,
	generate,
	existingProxy,
	adjustRisk,
}: {
	app: App;
	forkId: string;
	deposit: ActionData;
	generate?: ActionData;
	existingProxy?: boolean;
	adjustRisk?: { positionType?: 'Generate'; value: number };
}) => {
	await app.position.setup.deposit(deposit);
	if (generate) {
		await app.position.setup.generate(generate);
	}
	if (adjustRisk) {
		// TO BE DONE
	}
	if (!existingProxy) {
		await app.position.setup.setupProxy();
		await app.position.setup.createProxy();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		await app.position.setup.deposit(deposit);
		if (generate) {
			await app.position.setup.generate(generate);
		}
	}

	if (deposit.token !== 'ETH') {
		await app.position.setup.setTokenAllowance(deposit.token);
		await app.position.setup.setTokenAllowance(deposit.token);

		await expect(async () => {
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	await app.position.setup.confirm();
	await app.position.setup.continueWithoutStopLoss();
	await app.position.setup.createVault3Of3();
	await test.step('Metamask: ConfirmAddToken', async () => {
		await metamask.confirmAddToken();
	});

	await app.position.setup.goToVault();
	await app.position.manage.shouldBeVisible('Manage your vault');
};

export const adjustRisk = async ({
	forkId,
	app,
	earnPosition,
	shortPosition,
	risk,
	newSliderPosition,
}: {
	forkId: string;
	app: App;
	earnPosition?: boolean;
	shortPosition?: boolean;
	risk: 'up' | 'down';
	newSliderPosition: number;
}) => {
	const initialLiqPrice: number = await app.position.manage.getLiquidationPrice();
	let initialLoanToValue: number;
	if (!earnPosition) {
		initialLoanToValue = await app.position.manage.getLoanToValue();
	}

	await app.position.setup.moveSlider({ protocol: 'Ajna', value: newSliderPosition });

	await app.position.manage.confirm();

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines
	await app.page.waitForTimeout(3_000);
	await app.page.reload();

	// Wait for Liq price to update
	await expect(async () => {
		const updatedLiqPrice: number = await app.position.manage.getLiquidationPrice();
		let updatedLoanToValue: number;
		if (!earnPosition) {
			updatedLoanToValue = await app.position.manage.getLoanToValue();
		}

		if (risk === 'up') {
			if (shortPosition) {
				expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			} else {
				expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			}
			if (!earnPosition) {
				expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
			}
		} else {
			if (shortPosition) {
				expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			} else {
				expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			}
			if (!earnPosition) {
				expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
			}
		}
	}, 'New Liq. Price and LTV should be higher/lower than original ones').toPass();
};

export const close = async ({
	forkId,
	app,
	positionType,
	closeTo,
	collateralToken,
	debtToken,
	tokenAmountAfterClosing,
}: {
	forkId: string;
	app: App;
	positionType?: 'Multiply' | 'Borrow' | 'Earn (Liquidity Provision)' | 'Earn (Yield Loop)';
	closeTo: 'collateral' | 'debt';
	collateralToken: string;
	debtToken: string;
	tokenAmountAfterClosing: string;
}) => {
	await app.position.manage.openManageOptions({
		currentLabel: positionType === 'Borrow' ? collateralToken : 'Adjust',
	});
	await app.position.manage.select('Close position');
	if (closeTo === 'debt') {
		await app.position.manage.closeTo(debtToken);
	}
	await app.position.manage.shouldHaveTokenAmountAfterClosing({
		token: closeTo === 'collateral' ? collateralToken : debtToken,
		amount: tokenAmountAfterClosing,
	});

	await app.position.setup.confirm();

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position update
	//   - 'Reload' added to avoid flakines
	await app.page.waitForTimeout(2_000);
	await expect(async () => {
		await app.page.reload();
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
	}).toPass();

	// ============================================================

	await app.position.overview.shouldHaveNetValue({ value: '0.00' });
	await app.position.overview.shouldHaveDebt({
		amount: '0.00',
		token: debtToken,
		protocol: 'Ajna',
	});

	if (positionType !== 'Earn (Liquidity Provision)') {
		await app.position.overview.shouldHaveLoanToValue('0.00');
	}

	if (positionType === 'Borrow') {
		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '0.00',
			token: collateralToken,
		});
		await app.position.overview.shouldHaveAvailableToWithdraw({
			token: collateralToken,
			amount: '0.00',
		});
		await app.position.overview.shouldHaveAvailableToBorrow({ token: debtToken, amount: '0.00' });
	} else {
		await app.position.overview.shouldHaveExposure({ token: collateralToken, amount: '0.00' });
	}

	if (positionType == 'Multiply') {
		await app.position.overview.shouldHaveBuyingPower('0.00');
		await app.position.overview.shouldHaveMultiple('1.00');
	}
};

export const manageDebtOrCollateral = async ({
	app,
	forkId,
	protocol,
	allowanceNotNeeded,
	deposit,
	withdraw,
	borrow,
	payBack,
	expectedCollateralDeposited,
	expectedAvailableToWithdraw,
	expectedCollateralExposure,
	expectedDebt,
}: {
	app: App;
	forkId: string;
	protocol?: 'Aave V2' | 'Aave V3' | 'Spark';
	allowanceNotNeeded?: boolean;
	deposit?: ActionData;
	withdraw?: ActionData;
	borrow?: ActionData;
	payBack?: ActionData;
	expectedCollateralDeposited?: { token: string; amount: string };
	expectedAvailableToWithdraw?: { token: string; amount: string };
	expectedCollateralExposure?: { token: string; amount: string };
	expectedDebt?: { token: string; amount: string };
}) => {
	if (deposit) {
		await app.position.manage.deposit(deposit);
	}
	if (withdraw) {
		await app.position.manage.withdraw(withdraw);
	}
	if (borrow) {
		await app.position.manage.borrow(borrow);
	}
	if (payBack) {
		await app.position.manage.payBack(payBack);
	}

	if (
		!allowanceNotNeeded &&
		((deposit && deposit?.token !== 'ETH') || (payBack && payBack?.token !== 'ETH'))
	) {
		await app.position.setup.setTokenAllowance(deposit ? deposit?.token : payBack?.token);
		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowance();
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	if (protocol) {
		await app.position.setup.continue();
	} else {
		// // UI sometimes gets stuck after confirming position update
		// //   - 'Reload' added to avoid flakines
		await app.page.reload();
	}

	if (expectedCollateralDeposited) {
		await app.position.overview.shouldHaveCollateralDeposited({
			timeout: positionTimeout,
			...expectedCollateralDeposited,
		});
	}
	if (expectedAvailableToWithdraw) {
		await app.position.overview.shouldHaveAvailableToWithdraw({
			timeout: positionTimeout,
			...expectedAvailableToWithdraw,
		});
	}
	if (expectedCollateralExposure) {
		await app.position.overview.shouldHaveExposure({
			timeout: positionTimeout,
			...expectedCollateralExposure,
		});
	}
	if (expectedDebt) {
		await app.position.overview.shouldHaveDebt({
			timeout: positionTimeout,
			protocol: 'Ajna',
			...expectedDebt,
		});
	}
};

export const swapMakerToSpark = async ({
	app,
	forkId,
	reason,
	targetPool,
	expectedTargetExposure,
	expectedTargetDebt,
	originalPosition,
}: {
	app: App;
	forkId: string;
	reason: Reason;
	targetPool: string;
	expectedTargetExposure: ActionData;
	expectedTargetDebt: ActionData;
	originalPosition: { type: 'Borrow' | 'Multiply'; collateralToken: string; debtToken?: string };
}) => {
	const originalPositionPage: string = app.page.url();

	await app.position.overview.swap();
	await app.position.swap.selectReason(reason);
	await app.position.swap.productList.byPairPool(targetPool).open();

	// Smart DeFi Acount creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.createSmartDeFiAccount();
		await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
		await app.position.setup.continueShouldBeVisible();
	}).toPass({ timeout: longTestTimeout });

	await app.position.setup.continue();
	await app.position.swap.shouldHaveMaxTransactionCost();
	await app.position.swap.confirm();
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.continueShouldBeVisible();
		}).toPass();
	});

	await app.position.setup.continue();
	await app.position.swap.confirm();
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();
	});

	await app.position.setup.goToPosition();

	await app.position.manage.shouldBeVisible('Manage your Spark');
	await app.position.overview.shouldHaveExposure(expectedTargetExposure);
	await app.position.overview.shouldHaveDebt(expectedTargetDebt);

	// Verify that original Maker position is now empty
	await app.page.goto(originalPositionPage);
	await app.position.manage.shouldBeVisible('Manage your vault');
	await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
	await app.position.overview.shouldHaveVaultDaiDebt('0.0000');
	if (originalPosition.type === 'Multiply') {
		await app.position.overview.shouldHaveNetValue({ value: '\\$0.00' });
		await app.position.overview.shouldHaveTotalCollateral({
			amount: '0.00',
			token: originalPosition.collateralToken,
		});
	}
	if (originalPosition.type === 'Borrow') {
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
		await app.position.overview.shouldHaveCollateralizationRatio('0.00');
		await app.position.overview.shouldHaveCollateralLocked('0.00');
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '0.00000',
			token: originalPosition.collateralToken,
		});
		await app.position.overview.shouldHaveAvailableToGenerate({
			amount: '0.0000',
			token: originalPosition.debtToken,
		});
	}
};
