import { BrowserContext, expect, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp, setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

const walletPK: string = process.env.VERY_OLD_TEST_WALLET_PK;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 - Base - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(longTestTimeout);

		({ context } = await metamaskSetUp({ network: 'base' }));
		let page = await context.newPage();
		app = new App(page);

		await setup({
			app,
			network: 'base',
			withoutFork: true,
			withExistingWallet: {
				privateKey: walletPK,
			},
		});
	});

	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Base position - ETH/USDBC @regression', async () => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/ETH-USDBC#setup');

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

	test('It should open an Aave v3 Earn correlated Base position - CBETH/ETH @regression', async () => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/multiply/CBETH-ETH#setup');

		await app.position.setup.deposit({ token: 'CBETH', amount: '0.0007' });

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
