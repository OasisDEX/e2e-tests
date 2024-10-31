import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Aave V2 Earn - Wallet connected', async () => {
	test.beforeEach(async ({ page, metamask }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ forkId } = await setup({ metamask, app, network: 'mainnet' }));
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open an Aave v2 Earn position @regression', async ({ metamask }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/aave/v2/multiply/stETH-eth#simulate');

		//
		await app.pause();
		//

		await openPosition({
			metamask,
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10.09' },
		});
	});
});
