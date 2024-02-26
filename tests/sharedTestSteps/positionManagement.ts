import { expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { longTestTimeout, positionTimeout } from 'utils/config';

export const openPosition = async ({
	app,
	forkId,
	deposit,
	borrow,
}: {
	app: App;
	forkId: string;
	deposit: { token: string; amount: string };
	borrow?: { token: string; amount: string };
}) => {
	await app.position.setup.deposit(deposit);
	if (borrow) {
		await app.position.setup.borrow(borrow);
	}

	await app.position.setup.createSmartDeFiAccount();

	// Smart DeFi Acount creation randomly fails - Retry until it's created.
	await expect(async () => {
		await app.position.setup.createSmartDeFiAccount();
		await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
		await app.position.setup.continueShouldBeVisible();
	}).toPass({ timeout: longTestTimeout });

	await app.position.setup.continue();

	if (deposit.token !== 'ETH') {
		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowance();
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
	}

	// ======================================================================

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines

	await app.position.setup.confirm();
	await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmPermissionToSpend' });
	await app.position.setup.shouldShowCreatingPosition();

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

	// UI sometimes gets stuck after confirming position creation
	//   - 'Reload' added to avoid flakines
	await app.position.setup.confirm();
	await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmPermissionToSpend' });
	await app.position.setup.shouldShowUpdatingPosition();

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
	app,
	forkId,
	closeTo,
	collateralToken,
	debtToken,
	tokenAmountAfterClosing,
}: {
	app: App;
	forkId: string;
	closeTo: 'collateral' | 'debt';
	collateralToken: string;
	debtToken: string;
	tokenAmountAfterClosing: string;
}) => {
	await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
	await app.position.manage.select('Close position');
	if (closeTo === 'debt') {
		await app.position.manage.closeTo(debtToken);
	}
	await app.position.manage.shouldHaveTokenAmountAfterClosing({
		token: closeTo === 'collateral' ? collateralToken : debtToken,
		amount: tokenAmountAfterClosing,
	});

	await app.position.setup.confirm();

	// ============================================================

	// UI sometimes gets stuck after confirming position update
	//   - 'Reload' added to avoid flakines
	await app.position.setup.confirm();
	await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmPermissionToSpend' });
	await app.position.setup.shouldShowUpdatingPosition();
	await app.page.reload();

	// ============================================================

	await app.position.overview.shouldHaveLiquidationPrice({
		price: '0.00',
		timeout: positionTimeout,
	});
	await app.position.overview.shouldHaveLoanToValue('0.00');
	await app.position.overview.shouldHaveNetValue({ value: '0.00' });
	await app.position.overview.shouldHaveBuyingPower('0.00');
	await app.position.overview.shouldHaveExposure({ token: collateralToken, amount: '0.00' });
	await app.position.overview.shouldHaveDebt({
		amount: '0.00',
		token: debtToken,
		protocol: 'Ajna',
	});
	await app.position.overview.shouldHaveMultiple('1.00');
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

	// ============================================================

	// UI sometimes gets stuck after confirming position update
	//   - 'Reload' added to avoid flakines
	await app.position.setup.confirm();
	await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmPermissionToSpend' });
	await app.position.setup.shouldShowUpdatingPosition();
	await app.page.reload();

	// ============================================================

	await app.position.overview.shouldHaveCollateralDeposited({
		timeout: positionTimeout,
		...expectedCollateralDeposited,
	});
	await app.position.overview.shouldHaveDebt({
		protocol: 'Ajna',
		...expectedDebt,
	});
};
