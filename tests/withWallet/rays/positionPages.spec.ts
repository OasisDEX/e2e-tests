import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setup } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let forkId: string;
let walletAddress: string;
let app: App;

test.describe.configure({ mode: 'serial' });

test.describe('Rays - Wallet connected - Position page', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	// TEST TO BE REPLACED/UPDATED - Scenario has been moved to NO_WALLET section
	test('It should show position Rays - Wallet with no summer.fi positions @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'arbitrum',
				automationMinNetValueFlags: 'arbitrum:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		await app.position.overview.shouldHaveRays('0.0[0-9]{3}');
	});
});
