import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout, baseUrl } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Earn - Base - Wallet connected', async () => {
	test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

	test.beforeEach(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'base' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'base' }));

		await tenderly.setCbEthBalance({ forkId, cbEthBalance: '50' });
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12471',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/base/aave/v3/earn/cbetheth#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'CBETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();
		await app.position.setup.openMultiplyPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	// Risk UP -> 13035
});
