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
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Borrow - Swap to Morpho', async () => {
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
				extraFeaturesFlags: 'EnableRefinance:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WEETH',
				balance: '100',
			});
		});

		await app.page.goto('/ethereum/morphoblue/borrow/WEETH-ETH#setup');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WEETH', amount: '10' },
			borrow: { token: 'ETH', amount: '5' },
		});

		await app.page.waitForTimeout(3000);

		await swapPosition({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			originalProtocol: 'Morpho',
			targetProtocol: 'Morpho',
			targetPool: { colToken: 'SUSDE', debtToken: 'USDT' },
			upToStep5: true,
		});
	});

	(
		[
			{ colToken: 'EZETH', debtToken: 'ETH' },
			{ colToken: 'OSETH', debtToken: 'ETH' },
			{ colToken: 'PTWEETH', debtToken: 'USDA' },
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
			{ colToken: 'WSTETH', debtToken: 'ETH-1' },
			{ colToken: 'WSTETH', debtToken: 'ETH-2' },
			{ colToken: 'WSTETH', debtToken: 'ETH-3' },
			{ colToken: 'WSTETH', debtToken: 'USDA' },
			{ colToken: 'WSTETH', debtToken: 'USDC' },
			{ colToken: 'WSTETH', debtToken: 'USDT' },
		] as const
	).forEach((targetPool) =>
		test(`It should swap a Morpho Borrow position (WEETH/ETH) to Morpho Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				originalProtocol: 'Morpho',
				targetProtocol: 'Morpho',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
