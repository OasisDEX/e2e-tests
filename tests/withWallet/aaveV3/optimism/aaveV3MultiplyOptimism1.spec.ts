import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));

test.describe('Aave v3 Multiply - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'optimism' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage an Aave v3 Multiply Optimism position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '10.12345' },
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await tenderly.changeAccountOwner({
				account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
				newOwner: walletAddress,
				forkId,
			});

			await app.page.goto('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.9,
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.05,
			});
		});
	});

	test('It should close an existent Aave V3 Multiply Optimism position - Close to collateral token (ETH) @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		await app.page.waitForTimeout(1_000);

		await close({
			metamask,
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '0.[0-9]{3,4}',
		});
	});
});
