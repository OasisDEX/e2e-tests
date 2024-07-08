import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Borrow - Swap to Aave V3', async () => {
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
	test('Test setup - Open Maker Borrow position and start Swap process', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
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
				balance: '20',
			});
		});

		await app.page.goto('vaults/open/WBTC-C');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '0.2' },
			generate: { token: 'DAI', amount: '5000' },
		});

		await app.page.waitForTimeout(3000);

		await swapPosition({
			app,
			forkId,
			reason: 'Change direction of my position',
			originalProtocol: 'Maker',
			targetProtocol: 'Aave V3',
			targetPool: { colToken: 'SDAI', debtToken: 'ETH' },
			upToStep5: true,
		});
	});

	(
		[
			{ colToken: 'SDAI', debtToken: 'FRAX' },
			{ colToken: 'SDAI', debtToken: 'LUSD' },
			{ colToken: 'SDAI', debtToken: 'USDC' },
			{ colToken: 'SDAI', debtToken: 'USDT' },
			{ colToken: 'SDAI', debtToken: 'WBTC' },
			{ colToken: 'USDC', debtToken: 'ETH' },
			{ colToken: 'USDC', debtToken: 'USDT' },
			{ colToken: 'USDC', debtToken: 'WBTC' },
			{ colToken: 'USDT', debtToken: 'ETH' },
			{ colToken: 'USDC', debtToken: 'WSTETH' }, // BUG - 16003
		] as const
	).forEach((targetPool) =>
		test(`It should swap a Maker Borrow position (WBTC/DAI) to Aave V3 Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
				originalProtocol: 'Maker',
				targetProtocol: 'Aave V3',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				existingDpmAndApproval: true,
				rejectSwap: true,
			});
		})
	);
});
