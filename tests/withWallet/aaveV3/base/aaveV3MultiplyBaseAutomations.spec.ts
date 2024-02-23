import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import * as automations from '../../../sharedTestSteps/automations';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let positionId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open with Stop-Loss an Aave v3 Multiply Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'base' }));
		});

		await app.page.goto('/base/aave/v3/multiply/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10' });
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '([0-9],)?[0-9]{3}.[0-9]{1,2} USDC',
		});
		await app.position.setup.moveSlider({ value: 0.35, withWallet: true });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();

		await app.position.setup.setupStopLoss1Of3();
		await app.position.setup.confirm();

		// Stop Loss setup randomly fails - Retry until it's setup.
		await expect(async () => {
			await app.position.setup.confirmOrRetry(); // Stop-Loss 3/3
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.setupStopLossTransactionShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await expect(async () => {
			// Set up Stop-Loss transaction
			await app.position.setup.setupStopLossTransaction();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		positionId = await app.position.setup.getNewPositionId();
		console.log('+++ Position ID: ', positionId);

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should set Auto-Buy on an Aave v3 Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto(positionId);

		// Wait for all position data to be loaded
		await app.position.shouldHaveTab('Protection OFF');

		await automations.testAutoBuy({ app, forkId });
	});

	test('It should set Auto-Sell on an Aave v3 Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await automations.testAutoSell({ app, forkId });
	});

	test('It should set Regular Stop-Loss on an Aave v3 Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto(positionId);

		await automations.testRegularStopLoss({ app, forkId });
	});

	test('It should set Trailing Stop-Loss on an Aave v3 Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto(positionId);

		await automations.testTrailingStopLoss({ app, forkId });
	});
});
