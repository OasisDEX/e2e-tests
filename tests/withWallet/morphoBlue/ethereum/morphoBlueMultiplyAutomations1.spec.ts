import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';
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

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WBTC',
			balance: '10',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open a position and set Auto-Buy / Auto-Sell / Regular Stop-Loss - Morpho Blue Multiply WBTC/USDT @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WBTC-USDT#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WBTC', amount: '1' },
				adjustRisk: { positionType: 'Borrow', value: 0.5 },
			});
		});

		await test.step('Set Auto-Buy', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			await automations.testAutoBuy({
				metamask,
				app,
				forkId,
				protocol: 'Morpho Blue',
				verifyTriggerPayload: {
					protocol: 'morphoblue',
					collToken: 'mainnetWBTC',
					debtToken: 'mainnetUSDT',
				},
			});
		});

		await test.step('Set Auto-Sell', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			await automations.testAutoSell({
				metamask,
				app,
				forkId,
				protocol: 'Morpho Blue',
				verifyTriggerPayload: {
					protocol: 'morphoblue',
					collToken: 'mainnetWBTC',
					debtToken: 'mainnetUSDT',
				},
			});
		});

		await test.step('Set Regular Stop-Loss', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			await automations.testRegularStopLoss({
				metamask,
				app,
				forkId,
				verifyTriggerPayload: {
					protocol: 'morphoblue',
					collToken: 'mainnetWBTC',
					debtToken: 'mainnetUSDT',
					triggerToken: 'mainnetUSDT',
				},
			});
		});
	});
});
