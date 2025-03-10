import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

test.describe('Aave V3 Multiply - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'arbitrum',
			automationMinNetValueFlags: 'arbitrum:aavev3:0.001',
		}));

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
		await app.page.close();
	});

	test('It should set Auto-Buy, Auto-Sell & Regular Stop-Loss on an Aave v3 Arbitrum Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		// Pause to avoid random fails
		await app.page.waitForTimeout(4_000);

		await test.step('It should set Auto-Buy', async () => {
			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'arbitrumETH',
					debtToken: 'arbitrumDAI',
				},
			});
		});

		await test.step('It should set Auto-Sell', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testAutoSell({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'arbitrumETH',
					debtToken: 'arbitrumDAI',
				},
			});
		});

		await test.step('It should set Regular Stop-Loss', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testRegularStopLoss({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'arbitrumETH',
					debtToken: 'arbitrumDAI',
					triggerToken: 'arbitrumDAI',
				},
			});
		});
	});
});
