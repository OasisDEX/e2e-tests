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

// 'To Aave V3' failing at the moment - BUG to be fixed by devs
test.describe.skip('Morpho Blue Borrow - Swap to Aave V3', async () => {
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
			targetProtocol: 'Aave V3',
			targetPool: { colToken: 'ETH', debtToken: 'DAI' },
			upToStep5: true,
		});
	});

	(
		[
			{ colToken: 'CBETH', debtToken: 'ETH' },
			{ colToken: 'CBETH', debtToken: 'USDC' },
			{ colToken: 'DAI', debtToken: 'ETH' },
			{ colToken: 'DAI', debtToken: 'MKR' },
			{ colToken: 'DAI', debtToken: 'WBTC' },
			{ colToken: 'ETH', debtToken: 'DAI' },
			{ colToken: 'ETH', debtToken: 'USDC' },
			{ colToken: 'ETH', debtToken: 'USDT' },
			{ colToken: 'ETH', debtToken: 'WBTC' },
			{ colToken: 'LDO', debtToken: 'USDT' },
			{ colToken: 'LINK', debtToken: 'DAI' },
			{ colToken: 'LINK', debtToken: 'ETH' },
			{ colToken: 'LINK', debtToken: 'USDC' },
			{ colToken: 'LINK', debtToken: 'USDT' },
			{ colToken: 'MKR', debtToken: 'DAI' },
			{ colToken: 'RETH', debtToken: 'DAI' },
			{ colToken: 'RETH', debtToken: 'ETH' },
			{ colToken: 'RETH', debtToken: 'USDC' },
			{ colToken: 'RETH', debtToken: 'USDT' },
			{ colToken: 'SDAI', debtToken: 'ETH' },
			// { colToken: 'SDAI', debtToken: 'FRAX' },
			// { colToken: 'SDAI', debtToken: 'LUSD' },
			// { colToken: 'SDAI', debtToken: 'USDC' },
			// { colToken: 'SDAI', debtToken: 'USDT' },
			{ colToken: 'SDAI', debtToken: 'WBTC' },
			{ colToken: 'USDC', debtToken: 'ETH' },
			{ colToken: 'USDC', debtToken: 'USDT' },
			{ colToken: 'USDC', debtToken: 'WBTC' },
			{ colToken: 'USDC', debtToken: 'WSTETH' },
			{ colToken: 'USDT', debtToken: 'ETH' },
			{ colToken: 'WBTC', debtToken: 'DAI' },
			{ colToken: 'WBTC', debtToken: 'ETH' },
			{ colToken: 'WBTC', debtToken: 'LUSD' },
			{ colToken: 'WBTC', debtToken: 'USDC' },
			{ colToken: 'WBTC', debtToken: 'USDT' },
			{ colToken: 'WSTETH', debtToken: 'CBETH' },
			{ colToken: 'WSTETH', debtToken: 'DAI' },
			{ colToken: 'WSTETH', debtToken: 'ETH' },
			{ colToken: 'WSTETH', debtToken: 'LUSD' },
			{ colToken: 'WSTETH', debtToken: 'RPL' },
			{ colToken: 'WSTETH', debtToken: 'USDC' },
			{ colToken: 'WSTETH', debtToken: 'USDT' },
		] as const
	).forEach((targetPool) =>
		test(`It should swap a Morpho Borrow position (WEETH/ETH) to Aave V3 Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				originalProtocol: 'Morpho',
				targetProtocol: 'Aave V3',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
