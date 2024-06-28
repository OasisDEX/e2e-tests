import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';
import { SetBalanceTokens, aaveV3EthereumMultiplyPages_3, depositAmount } from 'utils/testData';
import { getCollTokenFromPositionUrl, getPoolFromPositionUrl } from 'utils/general';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

aaveV3EthereumMultiplyPages_3.forEach((page) => {
	const pool: string = getPoolFromPositionUrl({ url: page, positionType: 'multiply' });
	const collToken: string = getCollTokenFromPositionUrl({ url: page, positionType: 'multiply' });

	test.describe('Aave V3 Multiply - Wallet connected - Open position', async () => {
		test.afterAll(async () => {
			await tenderly.deleteFork(forkId);

			await app.page.close();

			await context.close();

			await resetState();
		});

		test(`It should open a Aave V3 Multiply position - ${pool}`, async () => {
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
				}));

				if (collToken !== 'ETH') {
					await tenderly.setTokenBalance({
						forkId,
						walletAddress,
						network: 'mainnet',
						token: collToken as SetBalanceTokens,
						balance: tenderly.tokenBalances[collToken],
					});
				}
			});

			await app.page.goto(page);

			await openPosition({
				app,
				forkId,
				deposit: { token: collToken, amount: depositAmount[collToken] },
			});
		});
	});
});
