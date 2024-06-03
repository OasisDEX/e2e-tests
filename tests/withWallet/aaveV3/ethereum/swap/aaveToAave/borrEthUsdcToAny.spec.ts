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

test.describe('Aave V3 Borrow - Swap to Aave V3', async () => {
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
			reason: 'Change direction of my position',
			originalProtocol: 'Aave V3',
			targetProtocol: 'Aave V3',
			targetPool: { colToken: 'SDAI', debtToken: 'ETH' },
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
			{ colToken: 'SDAI', debtToken: 'FRAX' },
			{ colToken: 'SDAI', debtToken: 'LUSD' },
			{ colToken: 'SDAI', debtToken: 'USDC' },
			{ colToken: 'SDAI', debtToken: 'USDT' },
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
		test(`It should swap an Aave V3 Multiply position (ETH/DAI) to Aave V3 Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				targetProtocol: 'Aave V3',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
