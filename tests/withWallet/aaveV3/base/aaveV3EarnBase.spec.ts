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

// Base ETH borrow cap at 100%
test.describe.skip('Aave V3 Earn - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn (Yield Loop) Base position @regression', async () => {
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

		await app.page.goto('/base/aave/v3/multiply/CBETH-ETH#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '1' },
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
			earnPosition: true,
			risk: 'up',
			newSliderPosition: 0.3,
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
			earnPosition: true,
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
			positionType: 'Earn (Yield Loop)',
			closeTo: 'debt',
			collateralToken: 'CBETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});
});
