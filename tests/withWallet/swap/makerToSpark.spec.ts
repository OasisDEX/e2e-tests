import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

// SKIP - Test tobe updated/fixed --> Priority gassettings need tobe changed for tx to suceed
test.describe.skip('Maker Multiply - Swap to Spark', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags: 'MakerTenderly:true',
		}));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create a Maker position as part of the Swap tests setup
	test('Open Maker Mutiply position (ETH-C/DAI) and Swap to SPARK (SDAI/ETH)', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/vaults/open-multiply/ETH-C', {
			positionType: 'Maker',
		});

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await test.step('OpenMaker position', async () => {
			await openMakerPosition({
				metamask,
				app,
				deposit: { token: 'ETH', amount: '3' },
			});
		});

		await test.step('Swap Maker position to Spark', async () => {
			// Wait an reload to avoid flakiness
			await app.page.waitForTimeout(3000);
			await app.page.reload();
			await app.page.waitForTimeout(3000);

			await swapPosition({
				metamask,
				app,
				vtId,
				reason: 'Switch to higher max Loan To Value',
				originalProtocol: 'Maker',
				targetProtocol: 'Spark',
				targetPool: { colToken: 'SDAI', debtToken: 'ETH' },
				rejectSwap: true,
			});
		});
	});
});
