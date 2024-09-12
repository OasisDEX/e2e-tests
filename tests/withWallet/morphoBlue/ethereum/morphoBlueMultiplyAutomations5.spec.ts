import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import * as automations from 'tests/sharedTestSteps/automations';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should update an existing Stop-Loss trigger on a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags:
					'LambdaAutomations:DisableNetValueCheck:true AaveV3LambdaSuppressValidation:true',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545#overview');

		await automations.testRegularStopLoss({
			app,
			forkId,
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
	test.skip('It should remove an existing Stop-Loss trigger on a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545#overview');

		await automations.testRegularStopLoss({
			app,
			forkId,
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
