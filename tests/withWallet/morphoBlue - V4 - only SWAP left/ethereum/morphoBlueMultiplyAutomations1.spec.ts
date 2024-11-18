import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { veryLongTestTimeout, longTestTimeout, extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Morpho Blue Multiply position - WBTC/USDT @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags:
					'LambdaAutomations:DisableNetValueCheck:true LambdaAutomations:MorphoBlue:autoBuy:true LambdaAutomations:MorphoBlue:autoSell:true LambdaAutomations:MorphoBlue:partialTakeProfit:true LambdaAutomations:MorphoBlue:stopLoss:true LambdaAutomations:MorphoBlue:trailingStopLoss:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'WBTC',
				balance: '10',
			});
		});

		await app.page.goto('/ethereum/morphoblue/multiply/WBTC-USDT#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '1' },
			adjustRisk: { positionType: 'Borrow', value: 0.5 },
		});
	});

	test('It should set Auto-Buy on a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testAutoBuy({
			app,
			forkId,
			protocol: 'Morpho Blue',
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWBTC',
				debtToken: 'mainnetUSDT',
			},
		});
	});

	test('It should set Auto-Sell on a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testAutoSell({
			app,
			forkId,
			protocol: 'Morpho Blue',
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWBTC',
				debtToken: 'mainnetUSDT',
			},
		});
	});

	test('It should set Regular Stop-Loss on a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testRegularStopLoss({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWBTC',
				debtToken: 'mainnetUSDT',
				triggerToken: 'mainnetUSDT',
			},
		});
	});
});
