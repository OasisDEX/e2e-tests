import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

// TODO - Failing with fork but passing with real network - To be investigated in fork
test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'base' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Aave v3 Multiply Base position - CBETH/USDBC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'base',
			token: 'CBETH',
			balance: '5',
		});

		await app.position.openPage('/base/aave/v3/multiply/cbeth-usdbc#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'CBETH', amount: '1' },
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Adjust risk - UP', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();
			await app.page.waitForTimeout(4_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'up',
				newSliderPosition: 0.4,
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Close position - To debt', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();
			await app.page.waitForTimeout(4_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Multiply',
				closeTo: 'debt',
				collateralToken: 'CBETH',
				debtToken: 'USDBC',
				tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});

	test('It should open and manage an Aave v3 Multiply Base position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/base/aave/v3/multiply/ETH-USDC#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '1' },
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Adjust risk - DOWN', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();
			await app.page.waitForTimeout(4_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				risk: 'down',
				newSliderPosition: 0.05,
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('Close position - To collateral', async () => {
			// Pause and reload to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.position.overview.shouldBeVisible();
			await app.page.waitForTimeout(4_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Multiply',
				closeTo: 'collateral',
				collateralToken: 'ETH',
				debtToken: 'USDC',
				tokenAmountAfterClosing: '[0-1].[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
