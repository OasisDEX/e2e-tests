import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave v3 Multiply - Mainnet - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
			automationMinNetValueFlags: 'mainnet:aavev3:0.001',
		}));

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should set Auto-Buy, Auto-Sell and Regular Stop-Loss on an Aave v3 Mainnet Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		await app.page.waitForTimeout(5_000);

		await test.step('Set Auto-Buy', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'mainnetETH',
					debtToken: 'mainnetUSDC',
				},
			});
		});

		await test.step('Set Auto-Sell', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await automations.testAutoSell({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'mainnetETH',
					debtToken: 'mainnetUSDC',
				},
			});
		});

		await test.step('Set Regular Stop-Loss', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await automations.testRegularStopLoss({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'mainnetETH',
					debtToken: 'mainnetUSDC',
					triggerToken: 'mainnetUSDC',
				},
			});
		});
	});

	test('It should set Trailing Stop-Loss on an Aave v3 Mainnet Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		// Pause to avoid random fails
		await app.page.waitForTimeout(4_000);

		await automations.testTrailingStopLoss({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
				triggerToken: 'mainnetUSDC',
			},
		});
	});

	// SKIP - TEST TO BE REVIEWED
	test.skip('It should set Partial Take Profit on an Aave v3 Mainnet Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/ethereum/aave/v3/multiply/eth-usdc/1218#overview');

		// Pause to avoid random fails
		await app.page.waitForTimeout(4_000);

		await automations.testPartialTakeProfit({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'mainnetETH',
				debtToken: 'mainnetUSDC',
				triggerToken: 'mainnetETH',
			},
		});
	});
});
