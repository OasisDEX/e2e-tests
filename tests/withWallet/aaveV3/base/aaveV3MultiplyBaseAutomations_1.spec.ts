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

test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should set Auto-Buy on an Aave v3 Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'base',
				automationMinNetValueFlags: 'base:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0xf71da0973121d949e1cee818eb519ba364406309',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/base/aave/v3/multiply/ETH-USDC/435#overview');

		await automations.testAutoBuy({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'baseETH',
				debtToken: 'baseUSDC',
			},
		});
	});

	test('It should set Auto-Sell on an Aave v3 Base Multiply position @regression', async () => {
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
				collToken: 'baseETH',
				debtToken: 'baseUSDC',
			},
		});
	});

	test('It should set Partial Take Profit on an Aave v3 Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testPartialTakeProfit({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'baseETH',
				debtToken: 'baseUSDC',
				triggerToken: 'baseETH',
			},
		});
	});
});
