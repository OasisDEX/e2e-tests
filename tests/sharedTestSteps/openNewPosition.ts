import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { SetBalanceTokens, depositAmount } from 'utils/testData';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

export const testArbitrum = testWithSynpress(metaMaskFixtures(arbitrumSetup));
export const testBase = testWithSynpress(metaMaskFixtures(baseSetup));
export const testEthereum = testWithSynpress(metaMaskFixtures(basicSetup));
export const testOptimism = testWithSynpress(metaMaskFixtures(optimismSetup));

export const openNewPosition = async ({
	network,
	protocol,
	pool,
	positionType,
}: {
	network: 'arbitrum' | 'base' | 'ethereum' | 'optimism';
	protocol: 'aave/v2' | 'aave/v3' | 'erc-4626' | 'morphoblue' | 'spark';
	pool: string;
	positionType: 'borrow' | 'earn' | 'multiply';
}) => {
	let app: App;
	let forkId: string;
	let walletAddress: string;

	const collToken: string =
		pool.split('-')[
			(network === 'ethereum' &&
				protocol === 'aave/v3' &&
				pool === 'WSTETH-ETH' &&
				positionType !== 'borrow') ||
			pool.includes('flagship') ||
			pool.includes('steakhouse')
				? 1
				: 0
		];

	const debtToken: string = pool.split('-')[1];

	const test =
		network === 'arbitrum'
			? testArbitrum
			: network === 'base'
			? testBase
			: network === 'ethereum'
			? testEthereum
			: testOptimism;

	test.describe(`${protocol} - ${network}`, async () => {
		test.beforeEach(async ({ metamask, page }) => {
			test.setTimeout(longTestTimeout);

			const setupNetwork = network === 'ethereum' ? 'mainnet' : network;

			app = new App(page);

			({ forkId, walletAddress } = await setup({
				metamask,
				app,
				network: setupNetwork,
			}));

			if (collToken !== 'ETH') {
				const setBalanceToken = collToken === 'USDC.E' ? 'USDC_E' : collToken;
				await tenderly.setTokenBalance({
					forkId,
					walletAddress,
					network: setupNetwork,
					token: setBalanceToken as SetBalanceTokens,
					balance: tenderly.tokenBalances[setBalanceToken as SetBalanceTokens],
				});
			}
		});

		test.afterEach(async () => {
			await tenderly.deleteFork(forkId);
		});

		test(`It should open a position - ${positionType.toUpperCase()} - ${pool}`, async ({
			metamask,
		}) => {
			test.setTimeout(extremelyLongTestTimeout);

			await app.position.openPage(`/${network}/${protocol}/${positionType}/${pool}#setup`);

			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				forkId,
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
	});
};
