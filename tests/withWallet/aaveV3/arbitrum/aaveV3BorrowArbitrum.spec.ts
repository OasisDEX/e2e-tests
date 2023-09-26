import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Arbitrum - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'arbitrum' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'arbitrum' }));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Arbitrum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12068',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/borrow/ethusdc');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '7.5' });
		await app.position.setup.borrow({ token: 'USDC', amount: '2000' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();
		await app.position.setup.openBorrowPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});
});
