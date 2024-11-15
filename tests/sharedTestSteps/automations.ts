import { test, expect } from '@playwright/test';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';
import { MetaMask } from '@synthetixio/synpress/playwright';

type Protocols = 'aave3' | 'spark' | 'morphoblue';

type Automations =
	| 'dma-stop-loss'
	| 'dma-trailing-stop-loss'
	| 'auto-sell'
	| 'auto-buy'
	| 'dma-partial-take-profit';

type Tokens =
	| 'arbitrumETH'
	| 'arbitrumDAI'
	| 'baseETH'
	| 'baseUSDC'
	| 'mainnetDAI'
	| 'mainnetETH'
	| 'mainnetUSDC'
	| 'mainnetUSDT'
	| 'mainnetWBTC'
	| 'mainnetWSTETH'
	| 'optimismETH'
	| 'optimismUSDC_E';

const tokenAddresses = {
	arbitrumETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
	arbitrumDAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
	baseETH: '0x4200000000000000000000000000000000000006',
	baseUSDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
	mainnetDAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
	mainnetETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	mainnetUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	mainnetUSDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
	mainnetWBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
	mainnetWSTETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
	optimismETH: '0x4200000000000000000000000000000000000006',
	optimismUSDC_E: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
};

let matchObject = ({
	automation,
	collToken,
	debtToken,
	triggerToken,
	protocol,
	action,
	noThreshold,
}: {
	automation: Automations;
	collToken: Tokens;
	debtToken: Tokens;
	triggerToken?: Tokens;
	protocol?: 'morphoblue';
	action?: 'update' | 'remove';
	noThreshold?: boolean | undefined;
}) => {
	return {
		action: action ?? 'add',
		dpm: expect.any(String),
		...(protocol && {
			protocol,
		}),
		position: {
			collateral: tokenAddresses[collToken],
			debt: tokenAddresses[debtToken],
		},
		triggerData: {
			...(automation !== 'dma-trailing-stop-loss' && {
				executionLTV: expect.any(String),
			}),
			...(['dma-stop-loss', 'dma-trailing-stop-loss'].includes(automation) && {
				token: tokenAddresses[triggerToken as Tokens],
			}),
			...(automation === 'dma-trailing-stop-loss' && {
				trailingDistance: expect.any(String),
			}),
			...(['auto-buy', 'auto-sell'].includes(automation) && {
				executionLTV: expect.any(String),
				targetLTV: expect.any(String),
				maxBaseFee: '300',
				[automation === 'auto-sell' ? 'useMinSellPrice' : 'useMaxBuyPrice']:
					noThreshold || action === 'remove' ? false : true,
			}),
			...(automation === 'dma-partial-take-profit' && {
				withdrawToken: tokenAddresses[triggerToken as Tokens],
				withdrawStep: expect.any(String),
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: expect.any(String),
						token: tokenAddresses[triggerToken as Tokens],
					},
					action: 'add',
				},
			}),
			...(protocol && {
				poolId: expect.any(String),
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
	action,
	noThreshold,
}: {
	app: App;
	automation: Automations;
	protocol: Protocols;
	collToken: Tokens;
	debtToken: Tokens;
	triggerToken?: Tokens;
	action?: 'update' | 'remove';
	noThreshold?: boolean | undefined;
}) => {
	const requestPromise = app.page.waitForRequest(
		(request) =>
			request.url().includes(`/${protocol}/${automation}`) && request.method() === 'POST',
		{ timeout: expectDefaultTimeout * 5 }
	);

	if (action === 'remove') {
		await app.position.protection.removeTrigger();
	} else {
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
			await app.position.protection.adjustAutoSellTrigger({ value: 0.96 });
		}
		if (automation === 'dma-partial-take-profit') {
			await app.position.optimization.adjustPartialTakeProfitTrigger({ value: 0.1 });
		}
	}

	const request = await requestPromise;
	const requestJson = await request.postDataJSON();

	const matchObjectParameters = {
		automation,
		collToken,
		debtToken,
		...(triggerToken && { triggerToken }),
		...(protocol === 'morphoblue' && { protocol }),
		...(action && { action }),
		noThreshold,
	};

	expect(requestJson).toMatchObject(matchObject(matchObjectParameters));
};

export const testRegularStopLoss = async ({
	metamask,
	app,
	forkId,
	verifyTriggerPayload,
	action,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		triggerToken: Tokens;
		action?: 'update' | 'remove';
	};
	action?: 'update' | 'remove';
}) => {
	await app.position.openTab('Protection');
	if (!action) {
		await app.position.protection.setup('Stop-Loss');
	}

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'dma-stop-loss',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			triggerToken: verifyTriggerPayload.triggerToken,
			action,
		});
	} else {
		await app.position.protection.adjustStopLossTrigger({ value: 0.7 });
	}

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmTransaction', forkId });
			await app.position.setup.finishedShouldBeVisible({ feature: 'Stop-Loss', action });
		}).toPass();
	});
};

export const testTrailingStopLoss = async ({
	metamask,
	app,
	forkId,
	verifyTriggerPayload,
}: {
	metamask: MetaMask;
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

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(10_000);

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmTransaction', forkId });
			await app.position.setup.finishedShouldBeVisible({ feature: 'Stop-Loss' });
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoSell = async ({
	metamask,
	app,
	forkId,
	protocol,
	strategy,
	verifyTriggerPayload,
	action,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	protocol?: 'Morpho Blue';
	strategy?: 'short';
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		action?: 'update' | 'remove';
	};
	action?: 'update' | 'remove';
}) => {
	await app.position.openTab('Protection');
	if (!action) {
		await app.position.protection.setup('Auto-Sell');
	}

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'auto-sell',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			action,
		});
	} else {
		await app.position.protection.adjustAutoSellTrigger({ value: 0.9 });
	}

	if (!strategy && !action) {
		await app.position.protection.shouldHaveMessage(
			'Please enter a minimum sell price or select Set No Threshold'
		);
		await app.position.protection.setNoThreshold();
		if (!protocol) {
			// Morpho BUG 15553
			await app.position.protection.shouldHaveMessage(
				'You are setting an auto sell trigger with no minimum sell price threshold'
			);
		}
	}

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(5000);

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmTransaction', forkId });
			await app.position.setup.finishedShouldBeVisible({ feature: 'Auto-Sell', action });
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testAutoBuy = async ({
	metamask,
	app,
	forkId,
	protocol,
	strategy,
	triggerLTV,
	verifyTriggerPayload,
	action,
	otherOptimizationsOn,
	setNoThreshold,
}: {
	metamask: MetaMask;
	app: App;
	forkId: string;
	protocol?: 'Morpho Blue';
	strategy?: 'short';
	triggerLTV?: number;
	verifyTriggerPayload?: {
		protocol: Protocols;
		collToken: Tokens;
		debtToken: Tokens;
		action?: 'update' | 'remove';
	};
	action?: 'update' | 'remove';
	otherOptimizationsOn?: boolean;
	setNoThreshold?: boolean;
}) => {
	await app.position.openTab('Optimization');
	if (!action) {
		await app.position.optimization.setupOptimization('Auto-Buy');
	}

	if (otherOptimizationsOn) {
		await app.position.optimization.openOptimizationDropDown({
			selectedOptimization: 'Auto Take Profit',
		});
		await app.position.optimization.selectOptimization('Auto-Buy');
	}

	if (setNoThreshold) {
		await app.position.optimization.setNoThreshold();
	}

	if (verifyTriggerPayload) {
		await verifyTriggerApiRequestPayload({
			app,
			automation: 'auto-buy',
			protocol: verifyTriggerPayload.protocol,
			collToken: verifyTriggerPayload.collToken,
			debtToken: verifyTriggerPayload.debtToken,
			action,
			noThreshold: setNoThreshold,
		});
	} else {
		await app.position.optimization.adjustAutoBuyTrigger({ value: triggerLTV ?? 0.2 });
	}

	if (!strategy && !action) {
		await app.position.optimization.shouldHaveMessage(
			'Please enter a maximum buy price or select Set No Threshold'
		);
		await app.position.optimization.setNoThreshold();
		if (!protocol) {
			// Morpho BUG 15553
			await app.position.optimization.shouldHaveMessage(
				'You are setting an auto buy trigger with no maximum buy price threshold'
			);
		}
	}

	// Pause needed to avoid random fails
	await app.page.waitForTimeout(4000);

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmTransaction', forkId });
			await app.position.setup.finishedShouldBeVisible({ feature: 'Auto-Buy', action });
		}).toPass({ timeout: longTestTimeout });
	});
};

export const testPartialTakeProfit = async ({
	metamask,
	app,
	forkId,
	verifyTriggerPayload,
}: {
	metamask: MetaMask;
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

	// Bug 15875 - Default Stop-Loss value is too high
	await app.position.optimization.adjustPartialTakeProfitStopLossTrigger({ value: 0.7 });
	await app.position.setup.orderInformation.shouldHaveMaxGasFee('[0-9]{1,2}.[0-9]{2}');

	await app.position.setup.confirm();

	// Automation setup randomly fails - Retry until it's set.
	await test.step('Confirm automation setup', async () => {
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamask, metamaskAction: 'confirmTransaction', forkId });
			await app.position.setup.finishedShouldBeVisible({ feature: 'Auto Take Profit' });
		}).toPass({ timeout: longTestTimeout });
	});
};
