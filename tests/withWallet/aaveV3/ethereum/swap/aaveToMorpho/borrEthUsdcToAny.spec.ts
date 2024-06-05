import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Swap to Morpho', async () => {
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
	test('It should open an Aave V3 Borrow position', async () => {
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
				extraFeaturesFlags: 'EnableRefinance:true',
			}));
		});

		await app.page.goto('/ethereum/aave/v3/borrow/ETH-USDC#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			borrow: { token: 'USDC', amount: '5000' },
		});

		await app.page.waitForTimeout(3000);

		await swapPosition({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			originalProtocol: 'Aave V3',
			targetProtocol: 'Morpho',
			targetPool: { colToken: 'WSTETH', debtToken: 'USDC' },
			upToStep5: true,
		});
	});

	(
		[
			{ colToken: 'EZETH', debtToken: 'ETH' },
			{ colToken: 'OSETH', debtToken: 'ETH' },
			// { colToken: 'PTWEETH', debtToken: 'USDA' },
			{ colToken: 'SUSDE', debtToken: 'DAI-1' },
			{ colToken: 'SUSDE', debtToken: 'DAI-2' },
			{ colToken: 'SUSDE', debtToken: 'DAI-3' },
			{ colToken: 'SUSDE', debtToken: 'DAI-4' },
			{ colToken: 'SUSDE', debtToken: 'USDT' },
			{ colToken: 'USDE', debtToken: 'DAI-1' },
			{ colToken: 'USDE', debtToken: 'DAI-2' },
			{ colToken: 'USDE', debtToken: 'DAI-3' },
			{ colToken: 'USDE', debtToken: 'DAI-4' },
			{ colToken: 'WBTC', debtToken: 'USDC' },
			{ colToken: 'WBTC', debtToken: 'USDT' },
			{ colToken: 'WEETH', debtToken: 'ETH' },
			{ colToken: 'WSTETH', debtToken: 'ETH-1' },
			{ colToken: 'WSTETH', debtToken: 'ETH-2' },
			{ colToken: 'WSTETH', debtToken: 'ETH-3' },
			// { colToken: 'WSTETH', debtToken: 'USDA' },
			{ colToken: 'WSTETH', debtToken: 'USDC' },
			{ colToken: 'WSTETH', debtToken: 'USDT' },
		] as const
	).forEach((targetPool) =>
		test(`It should swap an Aave V3 Borrow position (ETH/USDC) to Morpho Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			test.setTimeout(longTestTimeout);

			// Wait an reload to avoid flakiness
			await app.page.waitForTimeout(1000);
			await app.page.reload();

			await swapPosition({
				app,
				forkId,
				reason: 'Switch to higher max Loan To Value',
				originalProtocol: 'Aave V3',
				targetProtocol: 'Morpho',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
