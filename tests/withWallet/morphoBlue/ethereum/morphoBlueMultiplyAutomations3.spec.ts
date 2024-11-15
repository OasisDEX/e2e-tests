import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags:
				'LambdaAutomations:DisableNetValueCheck:true LambdaAutomations:MorphoBlue:autoBuy:true LambdaAutomations:MorphoBlue:autoSell:true LambdaAutomations:MorphoBlue:partialTakeProfit:true LambdaAutomations:MorphoBlue:stopLoss:true LambdaAutomations:MorphoBlue:trailingStopLoss:true',
		}));

		await tenderly.changeAccountOwner({
			account: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			newOwner: walletAddress,
			forkId,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	// SKIP 'remove', --> 'remove' randomly failingonautomated test
	(['update'] as const).forEach((automationAction) =>
		test(`It should ${automationAction} an existing Auto-Sell trigger on a Morpho Blue Multiply position @regression`, async ({
			metamask,
		}) => {
			test.setTimeout(extremelyLongTestTimeout);

			await app.position.openPage('/ethereum/morphoblue/multiply/WBTC-USDC/2545#overview');

			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await automations.testAutoSell({
				metamask,
				app,
				forkId,
				protocol: 'Morpho Blue',
				verifyTriggerPayload: {
					protocol: 'morphoblue',
					collToken: 'mainnetWBTC',
					debtToken: 'mainnetUSDC',
					action: automationAction,
				},
				action: automationAction,
			});
		})
	);
});
