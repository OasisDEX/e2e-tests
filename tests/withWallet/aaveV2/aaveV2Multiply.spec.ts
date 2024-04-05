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

test.describe('Aave v2 Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v2 Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11773',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/aave/v2/multiply/eth-usdc#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '2' },
			omni: { network: 'ethereum' },
		});
	});

	test('It should adjust risk of an existing Aave V2 Multiply position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.6,
		});
	});

	test('It should adjust risk of an existing Aave V2 Multiply position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.5,
		});
	});

	test('It should Close to collateral an existing Aave V2 Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await close({
			forkId,
			app,
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{3,4}',
		});
	});
});
