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
const { expect } = test;

test.describe('Spark Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage a Spark Multiply WSTETH/DAI Long position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/multiply/wsteth-dai');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '10' },
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await app.page.waitForTimeout(1_000);
			await app.page.reload();

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.8,
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.page.waitForTimeout(1_000);
			await app.page.reload();

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.2,
			});
		});

		await test.step('It should Close a position', async () => {
			await app.page.waitForTimeout(1_000);
			await app.page.reload();

			await close({
				metamask,
				app,
				forkId,
				positionType: 'Multiply',
				closeTo: 'collateral',
				collateralToken: 'WSTETH',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '9.[0-9]{1,4}',
			});
		});
	});
});
