import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'CBETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Aave V3 Earn Ethereum position - CBETH-ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/ethereum/aave/v3/earn/cbeth-eth#simulate');

		await test.step('It should Open a position', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'CBETH', amount: '10' },
				adjustRisk: { positionType: 'Earn', value: 0.5 },
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				earnPosition: true,
				risk: 'down',
				newSliderPosition: 0.2,
			});
		});

		await test.step('It should Close a position', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Earn (Yield Loop)',
				closeTo: 'collateral',
				collateralToken: 'CBETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '[0-9]{2}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
