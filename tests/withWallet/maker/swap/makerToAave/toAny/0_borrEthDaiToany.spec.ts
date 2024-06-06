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

// *******************************************
// Tests seems too heavy for running in github
// stopping the run randomly
// *******************************************
(
	[
		{
			colToken: 'CBETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'CBETH',
			debtToken: 'USDC',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'DAI',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'DAI',
			debtToken: 'MKR',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'DAI',
			debtToken: 'WBTC',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '0.[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'ETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'ETH',
			debtToken: 'USDC',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'ETH',
			debtToken: 'USDT',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'ETH',
			debtToken: 'WBTC',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '0.[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'LDO',
			debtToken: 'USDT',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'LINK',
			debtToken: 'DAI',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'LINK',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'LINK',
			debtToken: 'USDC',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'LINK',
			debtToken: 'USDT',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'MKR',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'RETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'RETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'RETH',
			debtToken: 'USDC',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'RETH',
			debtToken: 'USDT',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'SDAI',
			debtToken: 'FRAX',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'LUSD',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'USDC',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'USDT',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'SDAI',
			debtToken: 'WBTC',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '0.[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'USDC',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'USDC',
			debtToken: 'USDT',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'USDC',
			debtToken: 'WBTC',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '0.[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'USDC',
			debtToken: 'WSTETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'USDT',
			debtToken: 'ETH',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WBTC',
			debtToken: 'DAI',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WBTC',
			debtToken: 'ETH',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WBTC',
			debtToken: 'LUSD',
			exposure: '0.[0-9]{2}([0-9]{1,2})?',
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
			colToken: 'WSTETH',
			debtToken: 'CBETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'DAI',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'ETH',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[2-9].[0-9]{2}([0-9]{1,2})?',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'LUSD',
			exposure: '[0-9]{1,2}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
		},
		{
			colToken: 'WSTETH',
			debtToken: 'RPL',
			exposure: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			debt: '[1][4-7],[0-9]{3}.[0-9]{2}',
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
		`Maker Borrow - Swap to Aave V3 ${targetPool.colToken}/${targetPool.debtToken}`,
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

			test(`It should swap a Maker Borrow position (ETH/DAI) to Aave V3 Multiply ${targetPool.colToken}/${targetPool.debtToken})`, async () => {
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
					targetProtocol: 'Aave V3',
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
