import { expect, test } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { expectDefaultTimeout, longTestTimeout, positionTimeout } from 'utils/config';
import { Tokens } from 'utils/testData';
import { Reason } from 'src/pages/position/swap';
import { confirmAddToken } from './makerConfirmTx';
import { MetaMask } from '@synthetixio/synpress/playwright';

type ActionData = { token: string; amount: string };
type SwapProtocols = 'Aave V3' | 'Maker' | 'Morpho' | 'Spark';

/**
 *
 * @param adjustRisk should be between '0' and '1' both included | 0: far left in slider | 1: far right
 */
export const openPosition = async ({
	metamask,
	app,
	forkId,
	deposit,
	borrow,
	adjustRisk,
	protocol,
	ajnaExistingDpm,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	deposit: ActionData;
	borrow?: ActionData;
	adjustRisk?: { positionType?: 'Borrow' | 'Earn'; value: number };
	protocol?: 'Ajna' | 'Morpho Blue';
	ajnaExistingDpm?: boolean;
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

	const getButtonLabel = async (): Promise<string> => {
		// Wait for button to be enabled and correct label to be displayed
		await expect(async () => {
			const isEnabled = await app.page
				.locator('p:has-text("Configure your")')
				.locator('..')
				.locator('..')
				.locator('xpath=//following-sibling::div[2]')
				.getByRole('button')
				.isEnabled();

			expect(isEnabled).toBeTruthy();
		}).toPass();

		// Get Button label
		const label = await app.page
			.locator('p:has-text("Configure your")')
			.locator('..')
			.locator('..')
			.locator('xpath=//following-sibling::div[2]')
			.getByRole('button')
			.innerText();

		return label;
	};

	const buttonLabel = await getButtonLabel();

	if (buttonLabel === 'Create Smart DeFi account' && !ajnaExistingDpm) {
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await tx.confirmAndVerifySuccess({
				metamask,
				forkId,
				metamaskAction: 'confirmSignature',
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	if (deposit.token !== 'ETH') {
		if (buttonLabel === `Set ${deposit.token} allowance` || ajnaExistingDpm) {
			await app.position.setup.setTokenAllowance(deposit.token);
		}
		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowanceOrRetry();
			await tx.confirmAndVerifySuccess({
				metamask,
				forkId,
				metamaskAction: 'approveTokenPermission',
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });
		await app.position.setup.continue();
	}

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		// await tx.confirmAndVerifySuccess({ metamask, forkId, metamaskAction: 'confirmSignature' });
		await tx.confirmAndVerifySuccess({
			metamask,
			forkId,
			metamaskAction: 'confirmTransaction',
		});
	}).toPass({ timeout: longTestTimeout });

	if (protocol) {
		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines
		await app.page.reload();
		await app.position.setup.goToPosition();
		await expect(async () => {
			const applicationError = app.page.getByText('Aplication error:');

			if (await applicationError.isVisible()) {
				await app.page.reload();
			}
			await app.position.overview.shouldBeVisible();
		}).toPass({ timeout: expectDefaultTimeout * 5 });
	} else {
		await app.position.setup.goToPositionShouldBeVisible();
		const positionId: string = (await app.position.setup.getNewPositionId()) as string;
		//
		await app.page.waitForTimeout(10_000);
		//
		await expect(async () => {
			await app.page.goto(positionId);
			await expect(async () => {
				const applicationError = app.page.getByText('Aplication error:');

				if (await applicationError.isVisible()) {
					await app.page.reload();
				}
				await app.position.overview.shouldBeVisible();
			}).toPass({ timeout: expectDefaultTimeout * 5 });
		}).toPass();

		return positionId;
	}
};

export const openMakerPosition = async ({
	metamask,
	app,
	deposit,
	generate,
	existingProxy,
	adjustRisk,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	deposit: ActionData;
	generate?: ActionData;
	existingProxy?: boolean;
	adjustRisk?: { value: number };
}) => {
	await app.position.setup.deposit(deposit);
	if (generate) {
		await app.position.setup.generate(generate);
	}

	if (!existingProxy) {
		await app.position.setup.setupProxy();
		await app.position.setup.createProxy();
		await confirmAddToken({ metamask, app });

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
			// await tx.confirmAndVerifySuccess({ metamask, forkId, metamaskAction: 'confirmSignature' });
			await confirmAddToken({ metamask, app });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	if (adjustRisk) {
		await app.position.setup.moveSlider({
			protocol: 'Maker',
			value: adjustRisk?.value,
		});
	}

	await app.position.setup.confirm();
	await app.position.setup.continueWithoutStopLoss();

	await expect(async () => {
		await app.position.setup.createOrRetry();
		// await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmSignature', forkId });
		await confirmAddToken({ metamask, app });
	}).toPass();

	await app.position.setup.goToVault();
	await app.position.manage.shouldBeVisible('Manage your vault');
};

export const adjustRisk = async ({
	metamask,
	forkId,
	app,
	earnPosition,
	shortPosition,
	risk,
	newSliderPosition,
}: {
	metamask: MetaMask;
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
		await tx.confirmAndVerifySuccess({
			metamask,
			metamaskAction: 'confirmTransaction',
			forkId,
		});
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines
	await app.page.waitForTimeout(3_000);
	await app.page.reload();

	// Wait for Liq price to update
	await expect(async () => {
		const updatedLiqPrice: number = await app.position.manage.getLiquidationPrice();
		let updatedLoanToValue: number = 0;
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
	metamask,
	forkId,
	app,
	positionType,
	closeTo,
	collateralToken,
	debtToken,
	tokenAmountAfterClosing,
	openManagementOptionsDropdown,
}: {
	metamask: MetaMask;
	forkId: string;
	app: App;
	positionType?: 'Multiply' | 'Borrow' | 'Earn (Liquidity Provision)' | 'Earn (Yield Loop)';
	closeTo: 'collateral' | 'debt';
	collateralToken: string;
	debtToken: string;
	tokenAmountAfterClosing: string;
	openManagementOptionsDropdown?: { currentLabel: string };
}) => {
	if (openManagementOptionsDropdown) {
		await app.position.manage.openManageOptions({
			currentLabel: openManagementOptionsDropdown.currentLabel,
		});
	} else {
		await app.position.manage.openManageOptions({
			currentLabel: positionType === 'Borrow' ? collateralToken : 'Adjust',
		});
	}

	await app.position.manage.select('Close position');

	// Delay to avoid random fails
	await app.page.waitForTimeout(2_000);

	if (closeTo === 'debt') {
		await app.position.manage.closeTo(debtToken);
	}
	await app.position.manage.shouldHaveTokenAmountAfterClosing({
		token: closeTo === 'collateral' ? collateralToken : debtToken,
		amount: tokenAmountAfterClosing,
	});

	await app.position.setup.confirm();

	// Delay to reduce flakiness
	await app.page.waitForTimeout(10_000);

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({
			metamask,
			metamaskAction: 'confirmTransaction',
			forkId,
		});
	}, 'Confirm transaction in Summer.fi and Metamask').toPass({
		timeout: longTestTimeout,
	});

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
	metamask,
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
	metamask: MetaMask;
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
		await app.position.setup.setTokenAllowance((deposit?.token as string) ?? payBack?.token);
		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowanceOrRetry();
			await tx.confirmAndVerifySuccess({
				metamask,
				forkId,
				// metamaskAction: 'confirmSignature',
				metamaskAction: 'approveTokenPermission',
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	// =================
	// Recently added for Arbitrum Borrow ETH/USDC
	const manageHeader = app.page.getByText('Manage your ');
	const confirmButton = app.page.getByRole('button', { name: 'Confirm' });
	if ((await manageHeader.isVisible()) && (await confirmButton.isVisible())) {
		await app.position.setup.confirm();
	}
	// =================

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({
			metamask,
			metamaskAction: 'confirmTransaction',
			forkId,
		});
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

export const swapPosition = async ({
	metamask,
	app,
	forkId,
	originalProtocol,
	reason,
	targetProtocol,
	targetPool,
	verifyPositions,
	existingDpmAndApproval,
	upToStep5,
	rejectSwap,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	originalProtocol?: SwapProtocols;
	originalPosition?: { type: 'Borrow' | 'Multiply'; collateralToken: string; debtToken?: string };
	reason: Reason;
	targetProtocol?: SwapProtocols;
	targetPool: { colToken: Tokens; debtToken: Tokens };
	verifyPositions?: {
		originalPosition?: { type: 'Borrow' | 'Multiply'; collateralToken: string; debtToken?: string };
		targetPosition?: { exposure?: ActionData; debt?: ActionData };
	};
	existingDpmAndApproval?: boolean;
	upToStep5?: boolean;
	rejectSwap?: boolean;
}) => {
	let originalPositionPage: string;
	if (verifyPositions?.originalPosition) {
		originalPositionPage = app.page.url();
	}

	await app.position.overview.swap();
	await app.position.swap.selectReason(reason);

	if (targetProtocol) {
		await app.position.swap.productHub.filters.protocols.select({
			protocols: [targetProtocol],
		});
	}

	await app.position.swap.productHub.filters.collateralTokens.select(targetPool.colToken);

	let trimmedDebtToken: Tokens = 'ETH';
	if (targetPool.debtToken.includes('-')) {
		trimmedDebtToken = targetPool.debtToken.includes('ETH') ? 'ETH' : 'DAI';
	}
	await app.position.swap.productHub.filters.debtTokens.select(
		targetPool.debtToken.includes('-') ? trimmedDebtToken : targetPool.debtToken
	);

	await app.position.swap.productList
		.byPairPool(`${targetPool.colToken}/${targetPool.debtToken}`)
		.open();

	if (originalProtocol === 'Maker' && !existingDpmAndApproval) {
		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await tx.confirmAndVerifySuccess({
				metamask,
				forkId,
				metamaskAction: 'confirmSignature',
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
		await app.position.swap.shouldHaveMaxTransactionCost('\\$[0-9]{1,2}.[0-9]{1,2}');
		await app.position.swap.confirm();
		await test.step('Confirm automation setup', async () => {
			await expect(async () => {
				await tx.confirmAndVerifySuccess({
					metamask,
					metamaskAction: 'confirmTransaction',
					forkId,
				});
				await app.position.setup.continueShouldBeVisible();
			}).toPass();
		});

		await app.position.setup.continue();
	}

	if (!upToStep5) {
		await app.position.swap.shouldHaveMaxTransactionCost('.[0-9]{1,2}');
		await app.position.swap.confirmOrRetry();

		if (rejectSwap) {
			await test.step('Reject Permission To Spend', async () => {
				await expect(async () => {
					await tx.rejectPermissionToSpend({ metamask });
				}).toPass();
			});
		} else {
			await test.step('Confirm automation setup', async () => {
				await expect(async () => {
					await tx.confirmAndVerifySuccess({
						metamask,
						metamaskAction: 'confirmTransaction',
						forkId,
					});
					await app.position.setup.goToPositionShouldBeVisible();
				}).toPass();
			});

			await app.position.setup.goToPosition();

			if (verifyPositions?.targetPosition) {
				// Verify new target position
				await app.position.manage.shouldBeVisible(`Manage your ${targetProtocol}`);
				await app.position.overview.shouldHaveExposure(verifyPositions.targetPosition.exposure);

				let trimmedDebtToken: Tokens = 'ETH';
				if (verifyPositions.targetPosition.debt?.token.includes('-')) {
					trimmedDebtToken = verifyPositions.targetPosition.debt.token.includes('ETH')
						? 'ETH'
						: 'DAI';
				}

				await app.position.overview.shouldHaveDebt(
					verifyPositions.targetPosition.debt?.token.includes('-')
						? { ...verifyPositions.targetPosition.debt, token: trimmedDebtToken }
						: verifyPositions.targetPosition.debt
				);
			}

			if (verifyPositions?.originalPosition) {
				await expect(async () => {
					// Verify that original position is now empty
					await app.page.goto(originalPositionPage);

					await app.position.manage.shouldBeVisible('Manage your', { timeout: 25_000 });
				}).toPass();

				await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
				// TO BE UPDATE for all protocols
				// await app.position.overview.shouldHaveVaultDaiDebt('0.0000');
				// if (verifyPositions.originalPosition.type === 'Multiply') {
				// 	await app.position.overview.shouldHaveNetValue({ value: '\\$(<)?0.0[0-1]' });
				// 	// TO BE UPDATE for all protocols
				// 	// await app.position.overview.shouldHaveTotalCollateral({
				// 	// 	amount: '0.00',
				// 	// 	token: verifyPositions.originalPosition.collateralToken,
				// 	// });
				// }
				if (verifyPositions.originalPosition.type === 'Borrow') {
					await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
					await app.position.overview.shouldHaveCollateralizationRatio('0.00');
					await app.position.overview.shouldHaveCollateralLocked('0.00');
					await app.position.overview.shouldHaveAvailableToWithdraw({
						amount: '0.00000',
						token: verifyPositions.originalPosition.collateralToken,
					});
					await app.position.overview.shouldHaveAvailableToGenerate({
						amount: '0.0000',
						token: verifyPositions.originalPosition.debtToken as Tokens,
					});
				}
			}
		}
	}
};
