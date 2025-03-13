import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));

test.describe('Aave v3 Multiply - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'optimism',
			automationMinNetValueFlags: 'optimism:aavev3:0.001',
		}));

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should set Trailing Stop-Loss on an Aave v3 Optimism Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		await app.page.waitForTimeout(4_000);

		await automations.testTrailingStopLoss({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'optimismETH',
				debtToken: 'optimismUSDC_E',
				triggerToken: 'optimismUSDC_E',
			},
		});
	});

	test('It should set Partial Take Profit on an Aave v3 Optimism Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/eth-usdc.e/2#overview');

		await app.page.waitForTimeout(4_000);

		await automations.testPartialTakeProfit({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'aave3',
				collToken: 'optimismETH',
				debtToken: 'optimismUSDC_E',
				triggerToken: 'optimismETH',
			},
		});
	});
});
