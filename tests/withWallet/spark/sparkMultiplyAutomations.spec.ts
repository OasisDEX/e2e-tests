import { BrowserContext, expect, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import * as automations from 'tests/sharedTestSteps/automations';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Mainnet - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Deposit and Borrow in a single tx on an existing Spark Multiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});
		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				automationMinNetValueFlags: 'mainnet:sparkv3:0.0001',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'SDAI',
				balance: '50000',
			});
		});

		await tenderly.changeAccountOwner({
			account: '0xb585a1bae38dc735988cc75278aecae786e6a5d6',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/spark/v3/1448#overview');

		// Wait for all position data to be loaded
		await app.position.manage.shouldBeVisible('Manage Multiply position');
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await app.position.manage.deposit({ token: 'SDAI', amount: '10000' });
		await app.position.manage.borrow({ token: 'ETH', amount: '1.2' });

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken({});
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });
		await app.position.setup.continue();

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveNetValue({
			value: '\\$[1-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveExposure({
			amount: '10,[0-9]{3}.[0-9]{2}',
			token: 'SDAI',
		});
		await app.position.overview.shouldHaveDebt({ amount: '1.[0-9]{3,4}', token: 'ETH' });
	});

	test('It should set Auto-Buy on an Spark Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await automations.testAutoBuy({ app, forkId, strategy: 'short' });
	});

	test('It should set Auto-Sell on an Spark Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await automations.testAutoSell({ app, forkId, strategy: 'short' });
	});

	test('It should set Regular Stop-Loss on an Spark Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/1448#overview');

		await automations.testRegularStopLoss({ app, forkId });
	});

	// !!! NOT WORKING - There might be a bug - INVESTIGATING
	test.skip('It should set Trailing Stop-Loss on an Spark Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/1448#overview');

		await automations.testTrailingStopLoss({ app, forkId });
	});
});
