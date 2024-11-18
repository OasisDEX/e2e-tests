import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'DAI',
			balance: '30000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave v3 Multiply Ethereum position - DAI/WBTC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/dai-wbtc');

		await test.step('Open a position', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'DAI', amount: '15000.1234' },
			});
		});

		// SKIP if DB collision still hapenning with omni
		await test.step('Close position', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				forkId,
				app,
				closeTo: 'debt',
				collateralToken: 'DAI',
				debtToken: 'WBTC',
				tokenAmountAfterClosing: '[0-1].[0-9]{3,4}',
			});
		});
	});
});

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	// SKIP if DB collision still hapenning with omni
	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Down @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		// Pause to avoid flakiness
		await app.page.waitForTimeout(1_000);

		await adjustRisk({
			metamask,
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.05,
		});
	});

	// SKIP if DB collision still hapenning with omni
	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Up @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		// Pause to avoid flakiness
		await app.page.waitForTimeout(1_000);

		await adjustRisk({
			metamask,
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.9,
		});
	});
});
