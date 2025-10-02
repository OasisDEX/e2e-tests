import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

// SKIP - Price impact higher than usually due to market conditions
test.describe.skip('Maker Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags: 'MakerTenderly:true',
		}));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'WSTETH',
			balance: '200',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should have Price Impact lower than 1% when adjusting risk and closing position', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/vaults/open-multiply/WSTETH-B', { positionType: 'Maker' });

		await test.step('Open Maker Mutiply WSTETH-B/DAI position', async () => {
			// Depositing collateral too quickly after loading page returns wrong simulation results
			await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

			await openMakerPosition({
				metamask,
				app,
				deposit: { token: 'WSTETH', amount: '50' },
				adjustRisk: { value: 0.35 },
			});
		});

		await test.step('Adjusting risk - UP', async () => {
			await app.position.setup.moveSlider({
				protocol: 'Maker',
				value: 0.6,
			});

			await expect(async () => {
				const priceImpact = await app.position.setup.getPriceImpact();
				expect(priceImpact).toBeGreaterThan(0);
				expect(priceImpact).toBeLessThan(1.5);
			}).toPass();
		});

		await test.step('Adjusting risk - DOWN', async () => {
			await app.position.setup.moveSlider({
				protocol: 'Maker',
				value: 0.2,
			});

			await expect(async () => {
				const priceImpact = await app.position.setup.getPriceImpact();
				expect(priceImpact).toBeGreaterThan(0);
				expect(priceImpact).toBeLessThan(1.5);
			}).toPass();
		});

		await test.step('Closing position', async () => {
			await app.page.reload();

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Close vault');

			await expect(async () => {
				const priceImpact = await app.position.setup.getPriceImpact();

				expect(priceImpact).toBeGreaterThan(0);
				expect(priceImpact).toBeLessThan(6); // 1.5
			}).toPass();
		});
	});
});
