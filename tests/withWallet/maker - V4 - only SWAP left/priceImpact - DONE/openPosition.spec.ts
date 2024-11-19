import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('Test setup', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({
				app,
				network: 'mainnet',
				withoutFork: true,
			});
		});
	});

	(
		[
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
		] as const
	).forEach(({ ilk, depositAmount }) => {
		test(`It should have Price Impact lower than 1% when opening position - ${ilk} - Deposit amount: ${depositAmount}`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			await app.page.goto(`/vaults/open-multiply/${ilk}`);

			// Depositing collateral too quickly after loading page returns wrong simulation results
			await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
			await app.position.setup.deposit({ token: ilk.slice(0, -2), amount: depositAmount });

			await expect(async () => {
				const priceImpact = await app.position.setup.getPriceImpact();
				expect(priceImpact).toBeGreaterThan(0);
				expect(priceImpact).toBeLessThan(1.5);
			}).toPass();
		});
	});
});
