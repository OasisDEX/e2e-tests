import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import * as automations from 'tests/sharedTestSteps/automations';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Mainnet - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should set Auto-Buy on an Aave v3 Mainnet Multiply position @regression', async () => {
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
				automationMinNetValueFlags: 'mainnet:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		await automations.testAutoBuy({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
			},
		});
	});

	test('It should set Auto-Sell on an Aave v3 Mainnet Multiply position @regression', async () => {
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
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
			},
		});
	});

	test('It should set Regular Stop-Loss on an Aave v3 Mainnet Multiply position @regression', async () => {
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
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
				triggerToken: 'mainnetUSDC',
			},
		});
	});

	test('It should set Trailing Stop-Loss on an Aave v3 Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to avoid flakyness
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		await automations.testTrailingStopLoss({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
				triggerToken: 'mainnetUSDC',
			},
		});
	});

	test('It should set Partial Take Profit on an Aave v3 Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to avoid flakyness
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		await automations.testPartialTakeProfit({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
				triggerToken: 'mainnetETH',
			},
		});
	});
});
