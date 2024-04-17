import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'base',
				walletAddress,
				token: 'USDC',
				balance: '100000',
			});
		});

		await app.page.goto('/base/ajna/multiply/ETH-USDC');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '15' },
			protocol: 'Ajna',
		});
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.15,
		});
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.15,
		});
	});
});
