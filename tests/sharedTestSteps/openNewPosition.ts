import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { App } from 'src/app';
import { extremelyLongTestTimeout } from 'utils/config';
import { metamaskSetUp, setup } from 'utils/setup';
import { SetBalanceTokens, depositAmount } from 'utils/testData';
import { openPosition } from './positionManagement';

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
	let context: BrowserContext;
	let app: App;
	let forkId: string;
	let walletAddress: string;

	test.describe(`Open new position - ${network}/${protocol}/`, async () => {
		test.afterAll(async () => {
			await tenderly.deleteFork(forkId);

			await app.page.close();

			await context.close();

			await resetState();
		});

		test(`It should open a position - ${positionType.toUpperCase()} - ${pool}`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			test.setTimeout(extremelyLongTestTimeout);

			let collToken: string =
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

			let debtToken: string = pool.split('-')[1];

			await test.step('Test setup', async () => {
				const setupNetwork = network === 'ethereum' ? 'mainnet' : network;

				({ context } = await metamaskSetUp({ network: setupNetwork }));
				let page = await context.newPage();
				app = new App(page);

				({ forkId, walletAddress } = await setup({
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
						balance: tenderly.tokenBalances[setBalanceToken],
					});
				}
			});

			await app.position.openPage(`/${network}/${protocol}/${positionType}/${pool}#setup`);

			await openPosition({
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
									+depositAmount[debtToken === 'USDC.E' ? 'USDC_E' : debtToken] / 5
								).toString(),
						  }
						: null,
			});
		});
	});
};
