import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition, swapMakerToSpark } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Borrow - Swap', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1450, height: 720 },
	});

	// Create a Maker position as part of the Swap tests setup
	test('It should open a Maker Borrow position @regression @swap', async () => {
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
	});

	test('It should swap a Maker Borrow position (WBTC/DAI) to Spark Borrow (sDAI/ETH) @regression @swap', async () => {
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
				amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			expectedTargetDebt: {
				amount: '[0-9].[0-9]{2}([0-9]{1,2})?',
				token: 'ETH',
			},
			originalPosition: { type: 'Borrow', collateralToken: 'WBTC', debtToken: 'DAI' },
		});
	});
});
