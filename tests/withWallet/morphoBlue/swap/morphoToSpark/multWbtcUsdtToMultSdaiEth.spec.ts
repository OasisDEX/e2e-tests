import { BrowserContext, test } from '@playwright/test';
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

test.describe('Morpho Blue Multiply - Swap to Spark', async () => {
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
	test('It should open a Morpho Blue Borrow position', async () => {
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
				token: 'WBTC',
				balance: '10',
			});
		});

		await app.page.goto('/ethereum/morphoblue/multiply/WBTC-USDT#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '1' },
		});
	});

	test('It should swap a Morpho Blue Multiply position (WBTC/USDT) to Spark Multiply (SDAI/ETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// Wait an reload to avoid flakiness
		await app.page.waitForTimeout(1000);
		await app.page.reload();

		await swapPosition({
			app,
			forkId,
			reason: 'Change direction of my position',
			originalProtocol: 'Morpho',
			targetProtocol: 'Spark',
			targetPool: { colToken: 'SDAI', debtToken: 'ETH' },
			verifyPositions: {
				originalPosition: { type: 'Multiply', collateralToken: 'WBTC', debtToken: 'USDT' },
				targetPosition: {
					exposure: { amount: '[0-9]{2,3}[0-9],[0-9]{3}.[0-9]{2}', token: 'SDAI' },
					debt: { amount: '[1-4].[0-9]{2}', token: 'ETH' },
				},
			},
		});
	});
});
