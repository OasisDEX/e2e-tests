import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave v2 Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave v2 Multiply position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await test.step('It should open a position', async () => {
			await app.page.goto('/ethereum/aave/v2/multiply/eth-usdc#simulate');

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '2' },
			});
		});

		await test.step('It should Adjust Risk - Up', async () => {
			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.6,
			});
		});
	});

	test('It should open and manage an Aave v2 Multiply position - WBTC/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WBTC',
			balance: '1',
		});

		await test.step('It should open a position', async () => {
			await app.page.goto('/ethereum/aave/v2/multiply/wbtc-usdc#simulate');

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WBTC', amount: '0.1' },
			});
		});

		await test.step('It should Adjust Risk - Down', async () => {
			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.05,
			});
		});

		await test.step('It should close a position', async () => {
			await close({
				metamask,
				forkId,
				app,
				closeTo: 'collateral',
				collateralToken: 'WBTC',
				debtToken: 'USDC',
				tokenAmountAfterClosing: '0.[0-9]{3,4}',
			});
		});
	});
});
