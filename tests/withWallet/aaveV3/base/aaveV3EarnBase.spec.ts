import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Aave V3 Earn - Base - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'base' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'base',
			token: 'CBETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave V3 Earn (Yield Loop) Base position - CBETH/ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/CBETH-ETH#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'CBETH', amount: '1' },
			});
		});

		await test.step('Adjust risk - UP', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				earnPosition: true,
				risk: 'up',
				newSliderPosition: 0.3,
			});
		});

		await test.step('Adjust risk - DOWN', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				earnPosition: true,
				risk: 'down',
				newSliderPosition: 0.1,
			});
		});

		await test.step('Close position', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				app,
				forkId,
				positionType: 'Earn (Yield Loop)',
				closeTo: 'debt',
				collateralToken: 'CBETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
