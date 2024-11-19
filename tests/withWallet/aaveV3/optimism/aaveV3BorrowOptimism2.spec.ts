import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'optimism' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'optimism',
			token: 'DAI',
			balance: '50000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave V3 Borrow Optimism position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/optimism/aave/v3/borrow/DAI-WBTC#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'DAI', amount: '30000' },
				borrow: { token: 'WBTC', amount: '0.2' },
			});
		});

		// Randomly failing with automated test
		await test.step('Close position', async () => {
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				forkId,
				app,
				positionType: 'Borrow',
				closeTo: 'debt',
				collateralToken: 'DAI',
				debtToken: 'WBTC',
				tokenAmountAfterClosing: '0.[0-9]{3,4}',
			});
		});
	});
});
