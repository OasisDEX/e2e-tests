import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, gigaTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Spark Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'RETH',
			balance: '10',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage a Spark Earn (Yiel Loop) position - RETH/ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/ethereum/spark/multiply/RETH-ETH#setup');

		await test.step('Open position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'RETH', amount: '2' },
			});
		});

		await test.step('Adjust risk - UP', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				earnPosition: true,
				risk: 'up',
				newSliderPosition: 0.8,
			});
		});

		await test.step('Adjust risk - DOWN', async () => {
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				vtId,
				app,
				earnPosition: true,
				risk: 'down',
				newSliderPosition: 0.2,
			});
		});

		await test.step('Close position', async () => {
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Earn (Yield Loop)',
				closeTo: 'collateral',
				collateralToken: 'RETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
