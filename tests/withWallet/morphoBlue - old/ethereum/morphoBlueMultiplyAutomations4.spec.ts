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

	test('It should update an existing Auto-Buy trigger on a Morpho Blue Borrow position @regression', async () => {
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
			account: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-USDC/1467#overview');

		await automations.testAutoBuy({
			app,
			forkId,
			protocol: 'Morpho Blue',
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWSTETH',
				debtToken: 'mainnetUSDC',
				action: 'update',
			},
			action: 'update',
		});
	});

	// TO BE UPDATED - There seem to be issues with metamask in automated test
	test.skip('It should remove an existing Auto-Buy trigger on a Morpho Blue Multiply position @regression', async () => {
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
			account: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/morphoblue/borrow/WSTETH-USDC/1467#overview');

		await automations.testAutoBuy({
			app,
			forkId,
			protocol: 'Morpho Blue',
			verifyTriggerPayload: {
				protocol: 'morphoblue',
				collToken: 'mainnetWSTETH',
				debtToken: 'mainnetUSDC',
				action: 'remove',
			},
			action: 'remove',
		});
	});
});
