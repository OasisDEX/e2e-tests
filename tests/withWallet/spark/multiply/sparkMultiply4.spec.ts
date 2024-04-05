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
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Multiply Long position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WBTC',
				balance: '10',
			});
		});

		await app.page.goto('/ethereum/spark/multiply/wbtc-dai#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '1' },
			omni: { network: 'ethereum' },
		});
	});

	test('It should adjust risk of an existing Spark Multiply Long position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.7,
		});
	});

	test('It should adjust risk of an existing Spark Multiply Long position - Down', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12898',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.2,
		});
	});

	test('It should close an existent Spark Multiply Long position - Close to debt token (DAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'debt',
			collateralToken: 'WBTC',
			debtToken: 'DAI',
			tokenAmountAfterClosing: '[0-9]{2},[0-9]{3}.[0-9]{1,2}',
		});
	});
});
