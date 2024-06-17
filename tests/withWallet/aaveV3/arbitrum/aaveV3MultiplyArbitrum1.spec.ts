import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

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

	test('It should adjust risk of an existent Aave V3 Multiply Arbiturm position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12905',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.6,
		});
	});

	test('It should adjust risk of an existent Aave V3 Multiply Arbiturm position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12906',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.5,
		});
	});
});
