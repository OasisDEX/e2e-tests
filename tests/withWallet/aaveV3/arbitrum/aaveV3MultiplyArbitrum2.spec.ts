import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

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

			({ forkId } = await setup({ app, network: 'arbitrum' }));
		});

		await app.page.goto('/arbitrum/aave/v3/multiply/eth-usdc');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '8.12345' },
		});
	});

	test('It should close an existent Aave V3 Multiply Arbitrum position - Close to debt token (USDC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12907',
		});

		test.setTimeout(longTestTimeout);

		await close({
			forkId,
			app,
			closeTo: 'debt',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
	});
});
