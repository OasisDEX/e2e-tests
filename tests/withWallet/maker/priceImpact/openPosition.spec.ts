import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let app: App;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Maker Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		await setup({
			metamask,
			app,
			network: 'mainnet',
			withoutFork: true,
		});
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should have Price Impact lower than 1% when opening position', async () => {
		test.setTimeout(veryLongTestTimeout);

		const testCases = [
			{ ilk: 'WSTETH-A', depositAmount: '10' },
			{ ilk: 'WSTETH-A', depositAmount: '50' },
			{ ilk: 'WSTETH-B', depositAmount: '10' },
			{ ilk: 'WSTETH-B', depositAmount: '50' },
			{ ilk: 'ETH-A', depositAmount: '10' },
			{ ilk: 'ETH-A', depositAmount: '50' },
			{ ilk: 'ETH-B', depositAmount: '10' },
			{ ilk: 'ETH-B', depositAmount: '50' },
			{ ilk: 'ETH-C', depositAmount: '10' },
			{ ilk: 'ETH-C', depositAmount: '50' },
			{ ilk: 'WBTC-A', depositAmount: '0.5' },
			{ ilk: 'WBTC-A', depositAmount: '2' },
			{ ilk: 'WBTC-B', depositAmount: '0.5' },
			{ ilk: 'WBTC-B', depositAmount: '2' },
			{ ilk: 'WBTC-C', depositAmount: '0.5' },
			{ ilk: 'WBTC-C', depositAmount: '2' },
		];

		for (const testCase of testCases) {
			await test.step(`It should have Price Impact lower than 1% when opening position - ${testCase.ilk} - Deposit amount: ${testCase.depositAmount}`, async () => {
				await app.position.openPage(`/vaults/open-multiply/${testCase.ilk}`, {
					positionType: 'Maker',
				});

				// Depositing collateral too quickly after loading page returns wrong simulation results
				await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
				await app.position.setup.deposit({
					token: testCase.ilk.slice(0, -2),
					amount: testCase.depositAmount,
				});

				await expect(async () => {
					const priceImpact = await app.position.setup.getPriceImpact();
					expect(priceImpact).toBeGreaterThan(0);
					expect(priceImpact).toBeLessThan(1.5);
				}).toPass();
			});
		}
	});
});
