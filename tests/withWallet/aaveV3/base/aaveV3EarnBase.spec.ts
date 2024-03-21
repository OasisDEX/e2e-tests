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

test.describe('Aave V3 Earn - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12471',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'base',
				token: 'CBETH',
				balance: '20',
			});
		});

		await app.page.goto('/base/omni/aave/v3/multiply/cbeth-eth#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '5' },
			omni: { network: 'base' },
		});
	});

	test('It should adjust risk of an existent Aave V3 Earn Base position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13070',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.6,
		});
	});

	test('It should adjust risk of an existent Aave V3 Earn Base position - Down', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13069',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.1,
		});
	});

	test('It should close an existent Aave V3 Earn Base position - Close to debt token (ETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13071',
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
			collateralToken: 'CBETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});
});
