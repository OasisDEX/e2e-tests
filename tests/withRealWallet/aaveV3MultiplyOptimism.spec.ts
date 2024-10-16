import { BrowserContext, expect, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp, setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

const walletPK: string = process.env.VERY_OLD_TEST_WALLET_PK;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Optimism position - ETH/USDC @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12067',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({
				app,
				network: 'optimism',
				withoutFork: true,
				withExistingWallet: {
					privateKey: walletPK,
				},
			});
		});

		await app.page.goto('/optimism/aave/v3/multiply/eth-usdc#setup');

		await app.position.setup.deposit({ token: 'ETH', amount: '0.001' });

		await app.position.setup.confirm();
		// Thre are two 'confirm' steps
		await app.position.setup.confirm();

		await test.step('Reject Permission To Spend', async () => {
			await expect(async () => {
				await tx.rejectPermissionToSpend();
			}).toPass();
		});
	});
});
