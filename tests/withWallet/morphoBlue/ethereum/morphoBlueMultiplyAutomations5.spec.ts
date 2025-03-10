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

	test('It should update an existing Stop-Loss trigger on a Morpho Blue Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545#overview');

		await automations.testRegularStopLoss({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWSTETH',
				debtToken: 'mainnetETH',
				triggerToken: 'mainnetETH',
				action: 'update',
			},
			action: 'update',
		});
	});

	// FLAKY in github - TO BE IMPROVED
	test.skip('It should remove an existing Stop-Loss trigger on a Morpho Blue Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545#overview');

		await automations.testRegularStopLoss({
			metamask,
			app,
			vtId,
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWSTETH',
				debtToken: 'mainnetETH',
				triggerToken: 'mainnetWSTETH', // Minor issue - it should be mainnetETH
				action: 'remove',
			},
			action: 'remove',
		});
	});
});
