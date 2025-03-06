import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Spark Multiply - Mainnet - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId } = await setup({ metamask, app, network: 'mainnet' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should Open a position and set up all available Automations () - Spark Multiply ETH/DAI @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/multiply/ETH-DAI#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '10' },
				adjustRisk: { positionType: 'Borrow', value: 0.5 },
			});
		});

		await test.step('Set Regular Stop-Loss', async () => {
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
					protocol: 'spark',
					collToken: 'mainnetETH',
					debtToken: 'mainnetDAI',
					triggerToken: 'mainnetDAI',
				},
			});
		});

		await test.step('Set Trailing Stop-Loss', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testTrailingStopLoss({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'spark',
					collToken: 'mainnetETH',
					debtToken: 'mainnetDAI',
					triggerToken: 'mainnetDAI',
				},
			});
		});

		await test.step('Set Auto-Buy', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'spark',
					collToken: 'mainnetETH',
					debtToken: 'mainnetDAI',
				},
			});
		});

		await test.step('Set Auto-Sell', async () => {
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
					protocol: 'spark',
					collToken: 'mainnetETH',
					debtToken: 'mainnetDAI',
				},
			});
		});

		await test.step('Set Partial Take Profit', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testPartialTakeProfit({
				metamask,
				app,
				vtId,
				verifyTriggerPayload: {
					protocol: 'spark',
					collToken: 'mainnetETH',
					debtToken: 'mainnetDAI',
					triggerToken: 'mainnetETH',
				},
			});
		});
	});
});
