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
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Multiply - Swap to Spark', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create an Aave V3 position as part of the Swap tests setup
	test('It should open an Aave V3 Multiply position', async () => {
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
				token: 'LINK',
				balance: '5000',
			});
		});

		await app.page.goto('/ethereum/aave/v3/multiply/LINK-ETH#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'LINK', amount: '2000' },
		});
	});

	test('It should swap an Aave V3 Multiply position (LINK/ETH) to Spark Multiply (SDAI/ETH)', async () => {
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
			reason: 'Change direction of my position',
			targetPool: 'SDAI/ETH',
			expectedTargetExposure: {
				amount: '[1-6][0-9],[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			expectedTargetDebt: {
				amount: '[0-1].[0-9]{2}',
				token: 'ETH',
			},
			originalPosition: { type: 'Multiply', collateralToken: 'LINK', debtToken: 'ETH' },
		});
	});
});
