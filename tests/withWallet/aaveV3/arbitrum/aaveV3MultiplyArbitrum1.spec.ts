import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

test.describe('Aave V3 Multiply - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId } = await setup({ metamask, app, network: 'arbitrum' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Multiply Arbitrum ETH/USDC position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/ETH-USDC#setup');

		// Pause to avoid random fails
		await app.page.waitForTimeout(4_000);

		await test.step('It should Open a position', async () => {
			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '3.12345' },
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await app.page.waitForTimeout(4_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'up',
				newSliderPosition: 0.7,
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.page.waitForTimeout(4_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'down',
				newSliderPosition: 0.5,
			});
		});
	});
});
