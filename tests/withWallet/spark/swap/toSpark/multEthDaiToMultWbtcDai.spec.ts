import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition, swapMakerToSpark } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Borrow - Swap', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create a Maker position as part of the Swap tests setup
	test('It should open a Spark Multiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true EnableRefinance:true',
			}));
		});

		await app.page.goto('/ethereum/spark/multiply/ETH-DAI#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
		});
	});

	test('It should swap a Spark Multiply position (ETH/DAI) to Spark Multiply (WBTC/DAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// Wait an reload to avoid flakiness
		await app.page.waitForTimeout(1000);
		await app.page.reload();

		await swapMakerToSpark({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			targetPool: 'WBTC/DAI',
			expectedTargetExposure: { amount: '0.[0-9]{4}', token: 'WBTC' },
			expectedTargetDebt: { amount: '[0-9],[0-9]{3}.[0-9]{2}', token: 'DAI' },
			originalPosition: { type: 'Multiply', collateralToken: 'ETH', debtToken: 'DAI' },
		});
	});
});
