import { test, expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

export class Automations {}

export const testRegularStopLoss = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Protection');

	await app.position.protection.setup({
		protection: 'Stop-Loss',
		timeout: expectDefaultTimeout * 3,
	});
	await app.position.protection.selectStopLoss('Regular Stop-Loss');
	await app.position.protection.addStopLoss('Regular');

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(5000);

	await app.position.protection.addStopLossProtection();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
		}).toPass();
	});
};

export const testTrailingStopLoss = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Protection');

	await app.position.protection.setup({
		protection: 'Stop-Loss',
		timeout: expectDefaultTimeout * 3,
	});
	await app.position.protection.addStopLoss('Trailing');
	await app.position.protection.addStopLossProtection();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoSell = async ({
	app,
	forkId,
	strategy,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
}) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup({
		protection: 'Auto-Sell',
		timeout: expectDefaultTimeout * 3,
	});

	await app.position.protection.adjustAutoSellTrigger({ value: 0.8 });

	if (!strategy) {
		await app.position.protection.shouldHaveMessage(
			'Please enter a minimum sell price or select Set No Threshold'
		);
		await app.position.protection.setNoThreshold();
		await app.position.protection.shouldHaveMessage(
			'You are setting an auto sell trigger with no minimum sell price threshold'
		);
	}

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(5000);

	await app.position.protection.addAutoSell();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoBuy = async ({
	app,
	forkId,
	strategy,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
}) => {
	await app.position.openTab('Optimization');
	await app.position.optimization.setupOptimization('Auto-Buy');

	await app.position.optimization.adjustAutoBuyTrigger({ value: 0.2 });

	if (!strategy) {
		await app.position.optimization.shouldHaveMessage(
			'Please enter a maximum buy price or select Set No Threshold'
		);

		await app.position.optimization.setNoThreshold();
		await app.position.optimization.shouldHaveMessage(
			'You are setting an auto buy trigger with no maximum buy price threshold'
		);
	}

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(4000);

	await app.position.optimization.add('Auto-Buy');

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testPartialTakeProfit = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Optimization');

	await app.position.optimization.setupOptimization('Auto Take Profit');

	// Long pause needed to avoid random fails
	await app.page.waitForTimeout(10000);

	await app.position.optimization.add('Auto Take Profit');

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Auto Take Profit');
		}).toPass({ timeout: longTestTimeout });
	});
};
