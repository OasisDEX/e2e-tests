import { expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { longTestTimeout, positionTimeout } from 'utils/config';

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
}: {
	app: App;
	forkId: string;
	deposit: { token: string; amount: string };
	borrow?: { token: string; amount: string };
	existingDPM?: boolean;
	adjustRisk?: { value: number };
}) => {
	await app.position.setup.deposit(deposit);
	if (borrow) {
		await app.position.setup.borrow(borrow);
	}
	if (adjustRisk) {
		await app.position.setup.moveSliderOmni({ value: adjustRisk.value });
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
	} else if (deposit.token !== 'ETH') {
		await app.position.setup.setTokenAllowance(deposit.token);
	}

	if (deposit.token !== 'ETH') {
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

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines
	await app.page.reload();

	await app.position.setup.goToPosition();

	// ======================================================================

	await app.position.manage.shouldBeVisible('Manage ');
};

export const adjustRisk = async ({
	forkId,
	app,
	risk,
	newSliderPosition,
}: {
	forkId: string;
	app: App;
	risk: 'up' | 'down';
	newSliderPosition: number;
}) => {
	const initialLiqPrice = await app.position.manage.getLiquidationPrice();
	const initialLoanToValue = await app.position.manage.getLoanToValue();

	await app.position.setup.moveSlider({ protocol: 'Ajna', value: newSliderPosition });

	await app.position.manage.confirm();

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines
	await app.page.reload();

	// Wait for Liq price to update
	await expect(async () => {
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		if (risk === 'up') {
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		} else {
			expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
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
	positionType?: 'Multiply' | 'Borrow' | 'Earn';
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
	await app.page.reload();

	// ============================================================

	await app.position.overview.shouldHaveLiquidationPrice({
		price: '0.00',
		timeout: positionTimeout,
	});
	await app.position.overview.shouldHaveLoanToValue('0.00');
	await app.position.overview.shouldHaveNetValue({ value: '0.00' });
	await app.position.overview.shouldHaveDebt({
		amount: '0.00',
		token: debtToken,
		protocol: 'Ajna',
	});

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
		await app.position.overview.shouldHaveBuyingPower('0.00');
		await app.position.overview.shouldHaveMultiple('1.00');
	}
};

export const depositAndBorrow = async ({
	app,
	forkId,
	deposit,
	borrow,
	expectedCollateralDeposited,
	expectedDebt,
}: {
	app: App;
	forkId: string;
	deposit: { token: string; amount: string };
	borrow: { token: string; amount: string };
	expectedCollateralDeposited: { token: string; amount: string };
	expectedDebt: { token: string; amount: string };
}) => {
	await app.position.setup.deposit(deposit);
	await app.position.setup.borrow(borrow);

	await app.position.setup.confirm();

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position update
	//   - 'Reload' added to avoid flakines
	await app.page.reload();

	await app.position.overview.shouldHaveCollateralDeposited({
		timeout: positionTimeout,
		...expectedCollateralDeposited,
	});
	await app.position.overview.shouldHaveDebt({
		protocol: 'Ajna',
		...expectedDebt,
	});
};

export const withdrawAndPayBack = async ({
	app,
	forkId,
	withdraw,
	payback,
	expectedCollateralDeposited,
	expectedDebt,
}: {
	app: App;
	forkId: string;
	withdraw: { token: string; amount: string };
	payback: { token: string; amount: string };
	expectedCollateralDeposited: { token: string; amount: string };
	expectedDebt: { token: string; amount: string };
}) => {
	await app.position.manage.withdraw(withdraw);
	await app.position.manage.payback(payback);

	await app.position.setup.confirm();

	// Position creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.confirmOrRetry();
		await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
	}).toPass({ timeout: longTestTimeout });

	// UI sometimes gets stuck after confirming position update
	//   - 'Reload' added to avoid flakines
	await app.page.reload();

	await app.position.overview.shouldHaveCollateralDeposited({
		timeout: positionTimeout,
		...expectedCollateralDeposited,
	});
	await app.position.overview.shouldHaveDebt({
		protocol: 'Ajna',
		...expectedDebt,
	});
};
