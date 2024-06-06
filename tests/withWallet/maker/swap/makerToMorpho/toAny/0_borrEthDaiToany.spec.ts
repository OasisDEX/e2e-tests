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

// *************************************************
// Tests seems to be too heavy for running in github
// stopping the run randomly
// *************************************************
(
	[
		{
			colToken: 'EZETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'OSETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'SUSDE',
			debtToken: 'DAI-1',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SUSDE',
			debtToken: 'DAI-2',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SUSDE',
			debtToken: 'DAI-3',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SUSDE',
			debtToken: 'DAI-4',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SUSDE',
			debtToken: 'USDT',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'USDE',
			debtToken: 'DAI-1',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'USDE',
			debtToken: 'DAI-2',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'USDE',
			debtToken: 'DAI-3',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'USDE',
			debtToken: 'DAI-4',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WBTC',
			debtToken: 'USDC',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WBTC',
			debtToken: 'USDT',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WEETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'ETH-1',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'ETH-2',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'ETH-3',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'USDC',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'USDT',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
	] as const
).forEach((targetPool) =>
	test.describe.skip(
		`Maker Borrow - Swap to Morpho ${targetPool.colToken}/${targetPool.debtToken}`,
		async () => {
			test.afterAll(async () => {
				await tenderly.deleteFork(forkId);

				await app.page.close();

				await context.close();

				await resetState();
			});

			test.use({
				viewport: { width: 1400, height: 720 },
			});

			test(`It should swap a Maker Borrow position (ETH/DAI) to Morpho Multiply ${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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

				await app.page.goto('/vaults/open/ETH-C');

				// Depositing collateral too quickly after loading page returns wrong simulation results
				await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

				await openMakerPosition({
					app,
					forkId,
					deposit: { token: 'ETH', amount: '10' },
					generate: { token: 'DAI', amount: '15000' },
				});

				await swapPosition({
					app,
					forkId,
					reason: 'Switch to lower my cost',
					originalProtocol: 'Maker',
					targetProtocol: 'Morpho',
					targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
					verifyPositions: {
						originalPosition: { type: 'Borrow', collateralToken: 'ETH', debtToken: 'DAI' },
						targetPosition: {
							exposure: { amount: targetPool.exposure, token: targetPool.colToken },
							debt: { amount: targetPool.debt, token: targetPool.debtToken },
						},
					},
				});
			});
		}
	)
);
