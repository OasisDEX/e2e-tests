import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import * as automations from 'tests/sharedTestSteps/automations';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should set Auto-Buy on an Aave v3 Optimism Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'optimism',
				automationMinNetValueFlags: 'optimism:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		await automations.testAutoBuy({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'optimismETH',
				debtToken: 'optimismUSDC_E',
			},
		});
	});

	test('It should set Auto-Sell on an Aave v3 Optimism Multiply position @regression', async () => {
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
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'optimismETH',
				debtToken: 'optimismUSDC_E',
			},
		});
	});

	test('It should set Regular Stop-Loss on an Aave v3 Optimism Multiply position @regression', async () => {
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
				protocol: 'aave3',
				collToken: 'optimismETH',
				debtToken: 'optimismUSDC_E',
				triggerToken: 'optimismUSDC_E',
			},
		});
	});
});
