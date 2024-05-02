import { test, expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

type Protocols = 'aave3' | 'spark';

type Automations =
	| 'dma-stop-loss'
	| 'dma-trailing-stop-loss'
	| 'auto-sell'
	| 'auto-buy'
	| 'dma-partial-take-profit';

type Tokens = 'arbitrumETH' | 'arbitrumDAI';

const tokenAddresses = {
	arbitrumETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
	arbitrumDAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
};

let matchObject = ({
	automation,
	collToken,
	debtToken,
	triggerToken,
}: {
	automation: Automations;
	collToken: Tokens;
	debtToken: Tokens;
	triggerToken?: Tokens;
}) => {
	return {
		action: 'add',
		dpm: expect.any(String),
		position: {
			collateral: tokenAddresses[collToken],
			debt: tokenAddresses[debtToken],
		},
		triggerData: {
			...(automation !== 'dma-trailing-stop-loss' && {
				executionLTV: expect.any(String),
			}),
			...(['dma-stop-loss', 'dma-trailing-stop-loss'].includes(automation) && {
				token: tokenAddresses[triggerToken],
			}),
			...(automation === 'dma-trailing-stop-loss' && {
				trailingDistance: expect.any(String),
			}),
			...(['auto-buy', 'auto-sell'].includes(automation) && {
				executionLTV: expect.any(String),
				targetLTV: expect.any(String),
				maxBaseFee: '300',
				[automation === 'auto-sell' ? 'useMinSellPrice' : 'useMaxBuyPrice']: true,
			}),
			...(automation === 'dma-partial-take-profit' && {
				withdrawToken: tokenAddresses[triggerToken],
				withdrawStep: expect.any(String),
				executionPrice: '0',
				stopLoss: {
					triggerData: { executionLTV: expect.any(String), token: tokenAddresses[triggerToken] },
					action: 'add',
				},
			}),
		},
	};
};

const verifyTriggerApiRequestPayload = async ({
	app,
	automation,
	protocol,
	collToken,
	debtToken,
	triggerToken,
}: {
	app: App;
	automation: Automations;
	protocol: Protocols;
	collToken: Tokens;
	debtToken: Tokens;
	triggerToken?: Tokens;
}) => {
	const requestPromise = app.page.waitForRequest(
		(request) =>
			request.url().includes(`/${protocol}/${automation}`) && request.method() === 'POST',
		{ timeout: expectDefaultTimeout * 5 }
	);

	if (automation === 'dma-stop-loss') {
		await app.position.protection.adjustStopLossTrigger({ value: 0.7 });
	}
	if (automation === 'dma-trailing-stop-loss') {
		await app.position.protection.adjustTrailingStopLossTrigger({ value: 0.8 });
	}
	if (automation === 'auto-buy') {
		await app.position.optimization.adjustAutoBuyTrigger({ value: 0.1 });
	}
	if (automation === 'auto-sell') {
		await app.position.protection.adjustAutoSellTrigger({ value: 0.8 });
	}
	if (automation === 'dma-partial-take-profit') {
		await app.position.optimization.adjustPartialTakeProfitTrigger({ value: 0.1 });
	}

	const request = await requestPromise;
	const requestJson = await request.postDataJSON();

	expect(requestJson).toMatchObject(
		matchObject({ automation, collToken, debtToken, triggerToken })
	);
};

export const testRegularStopLoss = async ({
	app,
	forkId,
	verifyTriggerPayload,
}: {
	app: App;
	forkId: string;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		triggerToken: Tokens;
	};
}) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Stop-Loss');

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'dma-stop-loss',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			triggerToken: verifyTriggerPayload.triggerToken,
		});
	} else {
		await app.position.protection.adjustStopLossTrigger({ value: 0.7 });
	}

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

export const testTrailingStopLoss = async ({
	app,
	forkId,
	verifyTriggerPayload,
}: {
	app: App;
	forkId: string;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		triggerToken: Tokens;
	};
}) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Trailing Stop-Loss');

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'dma-trailing-stop-loss',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			triggerToken: verifyTriggerPayload.triggerToken,
		});
	} else {
		await app.position.protection.adjustTrailingStopLossTrigger({ value: 0.8 });
	}

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
	verifyTriggerPayload,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
	};
}) => {
	await app.position.openTab('Protection');
	await app.position.protection.setup('Auto-Sell');

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'auto-sell',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
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
	verifyTriggerPayload,
}: {
	app: App;
	forkId: string;
	strategy?: 'short';
	triggerLTV?: number;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
	};
}) => {
	await app.position.openTab('Optimization');
	await app.position.optimization.setupOptimization('Auto-Buy');

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'auto-buy',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
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

export const testPartialTakeProfit = async ({
	app,
	forkId,
	verifyTriggerPayload,
}: {
	app: App;
	forkId: string;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		triggerToken: Tokens;
	};
}) => {
	await app.position.openTab('Optimization');

	await app.position.optimization.setupOptimization('Auto Take Profit');

	// Long pause needed to avoid random fails
	await app.page.waitForTimeout(10000);

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'dma-partial-take-profit',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			triggerToken: verifyTriggerPayload.triggerToken,
		});
	} else {
		await app.position.optimization.adjustPartialTakeProfitTrigger({ value: 0.1 });
	}

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
