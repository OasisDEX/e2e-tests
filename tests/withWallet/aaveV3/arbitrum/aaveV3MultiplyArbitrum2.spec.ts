import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Multiply - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'arbitrum' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'arbitrum',
			token: 'WSTETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Multiply Arbitrum WSTETH/DAI position @regression', async ({
		metamask,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12068',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/wsteth-dai');

		await test.step('It should Open a position', async () => {
			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '8.12345' },
			});
		});

		await test.step('It should Close position', async () => {
			// To avoid flakiness
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				forkId,
				app,
				closeTo: 'debt',
				collateralToken: 'WSTETH',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
			});
		});
	});
});
