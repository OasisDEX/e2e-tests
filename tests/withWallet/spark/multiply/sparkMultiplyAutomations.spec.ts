import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import * as automations from 'tests/sharedTestSteps/automations';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Mainnet - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Multiply ETH/DAI position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/spark/multiply/ETH-DAI#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			adjustRisk: { positionType: 'Borrow', value: 0.5 },
		});
	});

	test('It should set Regular Stop-Loss on an Spark Mainnet Multiply position @regression', async () => {
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
				protocol: 'spark',
				collToken: 'mainnetETH',
				debtToken: 'mainnetDAI',
				triggerToken: 'mainnetDAI',
			},
		});
	});

	test('It should set Trailing Stop-Loss on an Spark Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testTrailingStopLoss({
			app,
			forkId,
			verifyTriggerPayload: {
				protocol: 'spark',
				collToken: 'mainnetETH',
				debtToken: 'mainnetDAI',
				triggerToken: 'mainnetDAI',
			},
		});
	});

	test('It should set Auto-Buy on an Spark Mainnet Multiply position @regression', async () => {
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
			verifyTriggerPayload: {
				protocol: 'spark',
				collToken: 'mainnetETH',
				debtToken: 'mainnetDAI',
			},
		});
	});

	test('It should set Auto-Sell on an Spark Mainnet Multiply position @regression', async () => {
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
				protocol: 'spark',
				collToken: 'mainnetETH',
				debtToken: 'mainnetDAI',
			},
		});
	});

	test('It should set Partial Take Profit on an Spark Mainnet Multiply position @regression', async () => {
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
				protocol: 'spark',
				collToken: 'mainnetETH',
				debtToken: 'mainnetDAI',
				triggerToken: 'mainnetETH',
			},
		});
	});
});
