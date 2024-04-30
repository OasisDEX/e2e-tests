import { test, expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

export class Automations {}

export const testRegularStopLoss = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Stop-Loss');

	await app.position.protection.adjustStopLossTrigger({ value: 0.7 });
	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Stop-Loss');
		}).toPass();
	});
};

export const testTrailingStopLoss = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Trailing Stop-Loss');

	await app.position.protection.adjustTrailingStopLossTrigger({ value: 0.8 });
	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Stop-Loss');
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoSell = async ({
	app,
	forkId,
	strategy,
	assertTriggerPayload,
	protocol,
	collTokenAddress,
	debtTokenAddress,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
	assertTriggerPayload?: boolean;
	protocol?: 'aave3' | 'spark';
	collTokenAddress?: string;
	debtTokenAddress?: string;
}) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Auto-Sell');

	if (assertTriggerPayload) {
		const requestPromise = app.page.waitForRequest(
			(request) => request.url().includes(`/${protocol}/auto-sell`) && request.method() === 'POST',
			{ timeout: expectDefaultTimeout * 5 }
		);

		await app.position.protection.adjustAutoSellTrigger({ value: 0.8 });

		const request = await requestPromise;
		const requestJson = await request.postDataJSON();

		expect(requestJson).toMatchObject({
			dpm: expect.any(String),
			triggerData: {
				executionLTV: expect.any(String),
				targetLTV: expect.any(String),
				maxBaseFee: '300',
				useMinSellPrice: true,
			},
			position: {
				collateral: collTokenAddress ?? expect.any(String),
				debt: debtTokenAddress ?? expect.any(String),
			},
			rpc: `https://rpc.tenderly.co/fork/${forkId}`,
			action: 'add',
		});
	} else {
		await app.position.protection.adjustAutoSellTrigger({ value: 0.8 });
	}

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

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Auto-Sell');
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoBuy = async ({
	app,
	forkId,
	strategy,
	triggerLTV,
	assertTriggerPayload,
	protocol,
	collTokenAddress,
	debtTokenAddress,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
	triggerLTV?: number;
	assertTriggerPayload?: boolean;
	protocol?: 'aave3' | 'spark';

	collTokenAddress?: string;
	debtTokenAddress?: string;
}) => {
	await app.position.openTab('Optimization');
	await app.position.optimization.setupOptimization('Auto-Buy');

	if (assertTriggerPayload) {
		const requestPromise = app.page.waitForRequest(
			(request) => request.url().includes(`/${protocol}/auto-buy`) && request.method() === 'POST',
			{ timeout: expectDefaultTimeout * 5 }
		);

		await app.position.optimization.adjustAutoBuyTrigger({ value: triggerLTV ?? 0.2 });

		const request = await requestPromise;
		const requestJson = await request.postDataJSON();

		expect(requestJson).toMatchObject({
			dpm: expect.any(String),
			triggerData: {
				executionLTV: expect.any(String),
				targetLTV: expect.any(String),
				maxBaseFee: '300',
				useMaxBuyPrice: true,
			},
			position: {
				collateral: collTokenAddress ?? expect.any(String),
				debt: debtTokenAddress ?? expect.any(String),
			},
			rpc: `https://rpc.tenderly.co/fork/${forkId}`,
			action: 'add',
		});
	} else {
		await app.position.optimization.adjustAutoBuyTrigger({ value: triggerLTV ?? 0.2 });
	}

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

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Auto-Buy');
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testPartialTakeProfit = async ({ app, forkId }: { app: App; forkId: string }) => {
	await app.position.openTab('Optimization');

	await app.position.optimization.setupOptimization('Auto Take Profit');

	// Long pause needed to avoid random fails
	await app.page.waitForTimeout(10000);

	await app.position.optimization.adjustPartialTakeProfitTrigger({ value: 0.1 });
	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await app.position.setup.finishedShouldBeVisible('Auto Take Profit');
		}).toPass({ timeout: longTestTimeout });
	});
};
