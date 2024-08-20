import { BrowserContext, expect, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

// SKIPPED - Not possible to use WBTC as collateral or to borrow it for SPARK
test.describe.skip('Morpho Blue Multiply - Swap to Spark', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create a Morpho Blue position as part of the Swap tests setup
	test('It should open a Morpho Blue Multiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true EnableRefinance:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WSTETH',
				balance: '100',
			});
		});

		await app.page.goto('/ethereum/morphoblue/multiply/WSTETH-USDT#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '10' },
		});
	});

	test('It should swap a Morpho Blue Multiply position (WSTETH/USDT) to Spark Multiply (WBTC/DAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// Wait an reload to avoid flakiness
		await app.page.waitForTimeout(1000);

		await expect(async () => {
			await app.page.reload();

			await swapPosition({
				app,
				forkId,
				reason: 'Switch to higher max Loan To Value',
				originalProtocol: 'Morpho',
				targetProtocol: 'Spark',
				targetPool: { colToken: 'WBTC', debtToken: 'DAI' },
				verifyPositions: {
					originalPosition: { type: 'Multiply', collateralToken: 'WSTETH', debtToken: 'USDT' },
					targetPosition: {
						exposure: { amount: '[0-1].[0-9]{2}([0-9]{1,2})?', token: 'WBTC' },
						debt: { amount: '[3-7],[0-9]{3}.[0-9]{2}', token: 'DAI' },
					},
				},
			});
		}).toPass();
	});
});
