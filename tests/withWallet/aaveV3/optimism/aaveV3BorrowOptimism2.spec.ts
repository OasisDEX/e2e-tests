import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup-optimism/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'optimism' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'optimism',
			token: 'DAI',
			balance: '50000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Aave V3 Borrow Optimism DAI/WBTC position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/optimism/aave/v3/borrow/DAI-WBTC#setup');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'DAI', amount: '30000' },
				borrow: { token: 'WBTC', amount: '0.1' },
			});
		});

		// Randomly failing with automated test
		await test.step('Close position', async () => {
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(4_000);

			await close({
				metamask,
				vtId,
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
