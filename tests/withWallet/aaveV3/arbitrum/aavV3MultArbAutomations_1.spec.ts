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
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Arbitrum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Arbitrum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12070',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'arbitrum' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'arbitrum',
				token: 'WBTC',
				balance: '2',
			});
		});

		await app.page.goto('/arbitrum/aave/v3/multiply/wbtc-dai#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '0.5' },
			adjustRisk: { positionType: 'Borrow', value: 0.5 },
			omni: { network: 'arbitrum' },
		});
	});

	test('It should set Auto-Buy on an Aave v3 Arbitrum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testAutoBuy({ app, forkId });
	});

	test('It should set Auto-Sell on an Aave v3 Arbitrum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testAutoSell({ app, forkId });
	});

	test('It should set Regular Stop-Loss on an Aave v3 Arbitrum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();
		await app.position.overview.shouldBeVisible();

		await automations.testRegularStopLoss({ app, forkId });
	});
});
