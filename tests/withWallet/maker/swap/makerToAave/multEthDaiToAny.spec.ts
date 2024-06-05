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
let positionPage: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Swap to Aave V3', async () => {
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
	test('Test setup - Open Maker Mutiply position and start Swap process', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
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

		await app.position.openPage('/vaults/open-multiply/ETH-C', { positionType: 'Maker' });

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
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

		// Needed for 'next' swap test
		positionPage = app.page.url();
	});

	(
		[
			// { colToken: 'CBETH', debtToken: 'ETH' },
			// { colToken: 'CBETH', debtToken: 'USDC' },
			{ colToken: 'DAI', debtToken: 'ETH' },
			// { colToken: 'DAI', debtToken: 'MKR' },
			{ colToken: 'DAI', debtToken: 'WBTC' },
			{ colToken: 'ETH', debtToken: 'DAI' },
			{ colToken: 'ETH', debtToken: 'USDC' },
			{ colToken: 'ETH', debtToken: 'USDT' },
			{ colToken: 'ETH', debtToken: 'WBTC' },
			// { colToken: 'LDO', debtToken: 'USDT' },
			// { colToken: 'LINK', debtToken: 'DAI' },
			// { colToken: 'LINK', debtToken: 'ETH' },
			// { colToken: 'LINK', debtToken: 'USDC' },
			// { colToken: 'LINK', debtToken: 'USDT' },
			// { colToken: 'MKR', debtToken: 'DAI' },
			{ colToken: 'RETH', debtToken: 'DAI' },
			// { colToken: 'RETH', debtToken: 'ETH' },
			{ colToken: 'RETH', debtToken: 'USDC' },
			{ colToken: 'RETH', debtToken: 'USDT' },
			{ colToken: 'SDAI', debtToken: 'ETH' },
			// { colToken: 'SDAI', debtToken: 'FRAX' },
			// { colToken: 'SDAI', debtToken: 'LUSD' },
			// { colToken: 'SDAI', debtToken: 'USDC' },
			// { colToken: 'SDAI', debtToken: 'USDT' },
			{ colToken: 'SDAI', debtToken: 'WBTC' },
			{ colToken: 'USDC', debtToken: 'ETH' },
			// { colToken: 'USDC', debtToken: 'USDT' },
			{ colToken: 'USDC', debtToken: 'WBTC' },
			{ colToken: 'USDC', debtToken: 'WSTETH' },
			{ colToken: 'USDT', debtToken: 'ETH' },
			{ colToken: 'WBTC', debtToken: 'DAI' },
			{ colToken: 'WBTC', debtToken: 'ETH' },
			// { colToken: 'WBTC', debtToken: 'LUSD' },
			{ colToken: 'WBTC', debtToken: 'USDC' },
			{ colToken: 'WBTC', debtToken: 'USDT' },
			// { colToken: 'WSTETH', debtToken: 'CBETH' },
			{ colToken: 'WSTETH', debtToken: 'DAI' },
			// { colToken: 'WSTETH', debtToken: 'ETH' },
			// { colToken: 'WSTETH', debtToken: 'LUSD' },
			// { colToken: 'WSTETH', debtToken: 'RPL' },
			{ colToken: 'WSTETH', debtToken: 'USDC' },
			{ colToken: 'WSTETH', debtToken: 'USDT' },
		] as const
	).forEach((targetPool) =>
		test(`It should swap a Maker Multiply position (ETH/DAI) to Aave V3 Multiply (${targetPool.colToken}/${targetPool.debtToken})`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			test.setTimeout(longTestTimeout);

			// Wait an reload to avoid flakiness
			await app.page.waitForTimeout(1000);
			await app.position.openPage(positionPage, { tab: 'Overview' });

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
