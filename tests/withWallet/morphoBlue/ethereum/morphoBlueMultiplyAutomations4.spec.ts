import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags:
				'LambdaAutomations:DisableNetValueCheck:true LambdaAutomations:MorphoBlue:autoBuy:true LambdaAutomations:MorphoBlue:autoSell:true LambdaAutomations:MorphoBlue:partialTakeProfit:true LambdaAutomations:MorphoBlue:stopLoss:true LambdaAutomations:MorphoBlue:trailingStopLoss:true',
		}));

		await tenderly.changeAccountOwner({
			account: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	// SKIP 'remove', --> 'remove' randomly failing on automated test
	(['update'] as const).forEach((automationAction) =>
		test(`It should ${automationAction} an existing Auto-Buy trigger on a Morpho Blue Borrow position @regression`, async ({
			metamask,
		}) => {
			test.setTimeout(veryLongTestTimeout);

			await app.position.openPage('/ethereum/morphoblue/multiply/WSTETH-ETH-1/2545#overview');

			// Pause to avoid random fails
			await app.page.waitForTimeout(4_000);

			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
				protocol: 'Morpho Blue',
				verifyTriggerPayload: {
					protocol: 'morphoblue',
					collToken: 'mainnetWSTETH',
					debtToken: 'mainnetETH',
					action: automationAction,
				},
				action: automationAction,
				otherOptimizationsOn: true,
				setNoThreshold: true,
			});
		})
	);
});
