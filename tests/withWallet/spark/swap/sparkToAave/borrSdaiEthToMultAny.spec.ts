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

test.describe('Spark Borrow - Swap to Aave V3', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create a Spark position as part of the Swap tests setup
	test('It should open a Spark Borrow position - SDAI/ETH', async () => {
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
				token: 'SDAI',
				balance: '10000',
			});
		});

		await app.page.goto('/ethereum/spark/borrow/SDAI-ETH#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'SDAI', amount: '7000' },
			borrow: { token: 'ETH', amount: '0.4' },
		});

		await app.page.waitForTimeout(3000);

		await swapPosition({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			targetPool: { colToken: 'ETH', debtToken: 'DAI' },
			upToStep5: true,
		});
	});

	([{ colToken: 'WBTC', debtToken: 'ETH' }] as const).forEach((targetPool) =>
		test(`It should swap a Spark Borrow position (SDAI/ETH) to Aave V3 Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				reason: 'Switch to higher max Loan To Value',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
