import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

(
	[
		{
			colToken: 'ETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WBTC',
			debtToken: 'DAI',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
			debt: '[4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'RETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[0-5].[0-9]{2}([0-9]{1,2})?',
		},
	] as const
).forEach((targetPool) =>
	test.describe(`Maker Borrow - Swap to Spark ${targetPool.colToken}/${targetPool.debtToken}`, async () => {
		test.afterAll(async () => {
			await tenderly.deleteFork(forkId);

			await app.page.close();

			await context.close();

			await resetState();
		});

		test.use({
			viewport: { width: 1400, height: 720 },
		});

		test(`It should swap a Maker Borrow position (WBTC/DAI) to Spark Multiply ${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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

			await swapPosition({
				app,
				forkId,
				reason: 'Switch to lower my cost',
				originalProtocol: 'Maker',
				targetProtocol: 'Spark',
				targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
				verifyPositions: {
					originalPosition: { type: 'Borrow', collateralToken: 'WBTC', debtToken: 'DAI' },
					targetPosition: {
						exposure: { amount: targetPool.exposure, token: targetPool.colToken },
						debt: { amount: targetPool.debt, token: targetPool.debtToken },
					},
				},
			});
		});
	})
);
