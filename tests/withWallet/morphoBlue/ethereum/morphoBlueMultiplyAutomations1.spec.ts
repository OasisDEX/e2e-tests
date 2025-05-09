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

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'WBTC',
			balance: '10',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open a position and set Auto-Buy / Auto-Sell / Regular Stop-Loss - Morpho Blue Multiply WBTC/USDT @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WBTC-USDT#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'WBTC', amount: '1' },
				adjustRisk: { positionType: 'Borrow', value: 0.5 },
			});
		});

		await test.step('Set Auto-Buy', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.position.overview.shouldBeVisible();

			await app.page.waitForTimeout(2_000);

			await automations.testAutoBuy({
				metamask,
				app,
				vtId,
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

			await app.page.waitForTimeout(2_000);

			await automations.testAutoSell({
				metamask,
				app,
				vtId,
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

			await app.page.waitForTimeout(2_000);

			await automations.testRegularStopLoss({
				metamask,
				app,
				vtId,
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
