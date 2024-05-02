import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import * as automations from 'tests/sharedTestSteps/automations';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Arbitrum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should set Trailing Stop-Loss on an Aave v3 Arbitrum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'arbitrum',
				automationMinNetValueFlags: 'arbitrum:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		await automations.testTrailingStopLoss({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'arbitrumETH',
				debtToken: 'arbitrumDAI',
				triggerToken: 'arbitrumDAI',
			},
		});
	});

	test('It should set Partial Take Profit on an Aave v3 Arbitrum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to avoid flakyness
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'arbitrum' }));
		});

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		await automations.testPartialTakeProfit({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'arbitrumETH',
				debtToken: 'arbitrumDAI',
				triggerToken: 'arbitrumETH',
			},
		});
	});
});
