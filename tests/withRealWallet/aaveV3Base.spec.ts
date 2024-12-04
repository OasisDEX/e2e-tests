import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseRealWalletSetup from 'utils/synpress/real-wallet-setup/baseRealWallet.setup';
import { setup } from 'utils/setup';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import 'dotenv/config';

let app: App;

const test = testWithSynpress(metaMaskFixtures(baseRealWalletSetup));
const { expect } = test;

test.describe('Aave v3 - Base - Wallet connected', async () => {
	test.beforeEach(async ({ page, metamask }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		await setup({
			metamask,
			app,
			network: 'base',
			withoutFork: true,
		});
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	[
		{ positionType: 'Multiply', pool: 'ETH-USDBC', depositAmount: '0.001' },
		{ positionType: 'Earn correlated', pool: 'CBETH-ETH', depositAmount: '0.0007' },
	].forEach(({ positionType, pool, depositAmount }) =>
		test(`It should open an Aave V3 Base ${positionType} position - ${pool} @regression`, async ({
			metamask,
		}) => {
			test.setTimeout(veryLongTestTimeout);

			await app.position.openPage(`/base/aave/v3/multiply/${pool}#setup`);
			// Delay to reduce flakiness
			await app.page.waitForTimeout(2_000);

			await app.position.setup.deposit({ token: pool.split('-')[0], amount: depositAmount });

			await app.position.setup.shouldHaveTransactionCostOrFee();

			await app.position.setup.confirm();
			// Delay to reduce flakiness
			await app.page.waitForTimeout(1_000);

			await expect(async () => {
				// Thre are two 'confirm' steps
				await app.position.setup.confirmOrRetry();
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		})
	);
});
