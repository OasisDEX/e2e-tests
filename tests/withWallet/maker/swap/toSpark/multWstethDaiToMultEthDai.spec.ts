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

test.describe('Maker Multiply - Swap', async () => {
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
	test('It should open a Maker Multiply position @regression', async () => {
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
				extraFeaturesFlags: 'MakerTenderly:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WSTETH',
				balance: '20',
			});
		});

		await app.page.goto('/vaults/open-multiply/WSTETH-B');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '10' },
		});
	});

	test('It should swap a Maker Multiply position (WSTETH/DAI) to Spark Multiply (ETH/DAI) @regression', async () => {
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
			reason: 'Switch to higher max Loan To Value',
			targetPool: 'ETH/DAI',
			expectedTargetExposure: {
				amount: '[0-9]{1,2}.[0-9]{2}',
				token: 'ETH',
			},
			expectedTargetDebt: {
				amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			originalPosition: { type: 'Multiply', collateralToken: 'WSTETH' },
		});
	});
});
