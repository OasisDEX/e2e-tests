import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

// TODO - Failing with fork but passing with real network - To be investigated in fork
test.describe.skip('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'base',
			automationMinNetValueFlags: 'base:aavev3:0.001',
		}));

		await tenderly.changeAccountOwner({
			account: '0xf71da0973121d949e1cee818eb519ba364406309',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should set Auto-Buy, Auto-Sell and Partial Take Profit on an Aave v3 Base Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/base/aave/v3/multiply/ETH-USDC/435#overview');

		await test.step('Set Auto-Buy', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'baseETH',
					debtToken: 'baseUSDC',
				},
			});
		});

		await test.step('Set Auto-Sell', async () => {
			// Reload page to avoid random fails
			await app.page.waitForTimeout(2_000);
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
					collToken: 'baseETH',
					debtToken: 'baseUSDC',
				},
			});
		});

		await test.step('Partial Take Profit', async () => {
			// Reload page to avoid random fails
			await app.page.waitForTimeout(2_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testPartialTakeProfit({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'baseETH',
					debtToken: 'baseUSDC',
					triggerToken: 'baseETH',
				},
			});
		});
	});

	test('It should set Regular Stop-Loss and Trailing Stop-Loss on an Aave v3 Base Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/base/aave/v3/multiply/ETH-USDC/435#overview');

		await test.step('Set Regular Stop-Loss', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testRegularStopLoss({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'baseETH',
					debtToken: 'baseUSDC',
					triggerToken: 'baseUSDC',
				},
			});
		});

		await test.step('Set Trailing Stop-Loss', async () => {
			// Reload page to avoid random fails
			await app.page.waitForTimeout(2_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testTrailingStopLoss({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'aave3',
					collToken: 'baseETH',
					debtToken: 'baseUSDC',
					triggerToken: 'baseUSDC',
				},
			});
		});
	});
});
