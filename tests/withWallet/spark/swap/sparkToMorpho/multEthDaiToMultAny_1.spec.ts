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

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Swap to Morpho', async () => {
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
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
		});

		await app.page.waitForTimeout(3000);

		await swapPosition({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			originalProtocol: 'Spark',
			targetProtocol: 'Morpho',
			targetPool: { colToken: 'WSTETH', debtToken: 'USDC' },
			upToStep5: true,
		});
	});

	(
		[
			{ colToken: 'WBTC', debtToken: 'USDC' },
			{ colToken: 'SUSDE', debtToken: 'USDT' },
			{ colToken: 'USDE', debtToken: 'DAI-1' },
			{ colToken: 'WSTETH', debtToken: 'ETH-1' },
		] as const
	).forEach((targetPool) =>
		test(`It should swap a Spark Multiply position (ETH/DAI) to Morpho Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				originalProtocol: 'Spark',
				targetProtocol: 'Morpho',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
