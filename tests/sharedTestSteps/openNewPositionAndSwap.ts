import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { SetBalanceTokens, Tokens, depositAmount } from 'utils/testData';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

export type Scenario = {
	protocol: 'aave/v3' | 'morphoblue' | 'spark';
	pool: string;
	positionType: 'borrow' | 'multiply';
	targetProtocol: 'Aave V3' | 'Maker' | 'Morpho' | 'Spark';
	targetPools: { colToken: Tokens; debtToken: Tokens }[];
};

export const test = testWithSynpress(metaMaskFixtures(basicSetup));

export const openNewPositionAndSwap = async ({
	protocol,
	pool,
	positionType,
	targetProtocol,
	targetPools,
}: Scenario) => {
	let app: App;
	let vtId: string;
	let vtRPC: string;
	let walletAddress: string;

	const originalProtocol: 'Aave V3' | 'Morpho' | 'Spark' =
		protocol === 'aave/v3' ? 'Aave V3' : protocol === 'morphoblue' ? 'Morpho' : 'Spark';

	const collToken: string =
		pool.split('-')[
			protocol === 'aave/v3' && pool === 'WSTETH-ETH' && positionType !== 'borrow' ? 1 : 0
		];

	const debtToken: string = pool.split('-')[1];

	const targetPoolsString = targetPools
		.map((pool) => `${pool.colToken}/${pool.debtToken}`)
		.join(' | ');

	test.describe('OPEN position and SWAP it', async () => {
		test.beforeEach(async ({ metamask, page }) => {
			test.setTimeout(longTestTimeout);

			app = new App(page);

			({ vtId, vtRPC, walletAddress } = await setup({
				metamask,
				app,
				network: 'mainnet',
			}));

			if (collToken !== 'ETH') {
				const setBalanceToken = collToken === 'USDC.E' ? 'USDC_E' : collToken;
				await tenderly.setTokenBalance({
					vtRPC,
					walletAddress,
					network: 'mainnet',
					token: setBalanceToken as SetBalanceTokens,
					balance: tenderly.tokenBalances[setBalanceToken as SetBalanceTokens],
				});
			}
		});

		test.afterEach(async () => {
			await tenderly.deleteFork(vtId);
		});

		test(`It should OPEN a '${originalProtocol} ${positionType} ${pool}' position & SWAP it to '${targetProtocol} ${targetPoolsString}'`, async ({
			metamask,
		}) => {
			test.setTimeout(gigaTestTimeout);

			await app.position.openPage(`/ethereum/${protocol}/${positionType}/${pool}#setup`);

			await test.step('Open position', async () => {
				// Depositing collateral too quickly after loading page returns wrong simulation results
				await app.position.overview.waitForComponentToBeStable();

				await openPosition({
					metamask,
					app,
					vtId,
					deposit: {
						token: collToken,
						amount: depositAmount[collToken === 'USDC.E' ? 'USDC_E' : collToken],
					},
					borrow:
						positionType === 'borrow'
							? {
									token: debtToken,
									amount: (
										+depositAmount[debtToken === 'USDC.E' ? 'USDC_E' : debtToken] / 7
									).toString(),
							  }
							: undefined,
				});
			});

			// ==== STEP TO BE ADDED FOR MAKER ===

			// await test.step('Setup step for Swap tests', async () => {
			// 	// Delay to avoid flakiness
			// 	await app.page.waitForTimeout(3000);

			// In this step we can always use thes parameters/values
			// 	await swapPosition({
			// 		metamask,
			// 		app,
			// 		vtId,
			// 		reason: 'Switch to higher max Loan To Value',
			// 		originalProtocol,
			// 		targetProtocol: 'Morpho',
			// 		targetPool: { colToken: 'WSTETH', debtToken: 'USDC' },
			// 		upToStep5: true,
			// 	});
			// });

			for (const targetPool of targetPools) {
				await test.step(`Swap position`, async () => {
					// Wait an reload to avoid flakiness
					await app.page.waitForTimeout(3000);
					await app.page.reload();
					await app.page.waitForTimeout(2000);

					await swapPosition({
						metamask,
						app,
						vtId,
						reason: 'Switch to higher max Loan To Value',
						originalProtocol,
						targetProtocol,
						targetPool: { colToken: targetPool.colToken, debtToken: targetPool.debtToken },
						existingDpmAndApproval: true,
						rejectSwap: true,
					});
				});
			}
		});
	});
};
