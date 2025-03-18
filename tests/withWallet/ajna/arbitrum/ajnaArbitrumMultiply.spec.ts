import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

// No liquidity - Enable when liquidity available
test.describe.skip('Ajna Arbitrum Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'arbitrum' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'arbitrum',
			token: 'RETH',
			balance: '50',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open an Ajna Arbitrum Multiply position @regression', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/ajna/multiply/RETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			metamask,
			app,
			vtId,
			deposit: { token: 'RETH', amount: '0.5' },
			protocol: 'Ajna',
		});
	});
});
