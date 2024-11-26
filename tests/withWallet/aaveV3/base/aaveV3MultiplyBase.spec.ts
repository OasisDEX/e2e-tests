import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'base' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'base',
			token: 'CBETH',
			balance: '5',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave v3 Multiply Base position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/cbeth-usdbc#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'CBETH', amount: '1' },
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Adjust risk - UP', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.4,
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Adjust risk - DOWN', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.1,
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Close position', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				app,
				forkId,
				positionType: 'Multiply',
				closeTo: 'debt',
				collateralToken: 'CBETH',
				debtToken: 'USDBC',
				tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
