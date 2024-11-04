import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

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

	test('It should open an Aave v3 Multiply Optimism position - ETH/USDC @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12067',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'optimism' }));
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10.12345' },
		});
	});

	test('It should adjust risk of an existent Aave V3 Multiply Optimism position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12909',
		});

		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.9,
		});
	});

	test('It should adjust risk of an existent Aave V3 Multiply Optimism position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12910',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.05,
		});
	});

	test('It should close an existent Aave V3 Multiply Optimism position - Close to collateral token (ETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12911',
		});

		test.setTimeout(veryLongTestTimeout);
		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'optimism' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		test.setTimeout(veryLongTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '0.[0-9]{3,4}',
		});
	});
});
