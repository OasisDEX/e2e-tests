import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Mainnet - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should set Auto-Buy on an Aave v3 Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				automationMinNetValueFlags: 'mainnet:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/1218#overview');

		await app.position.openTab('Optimization');
		await app.position.optimization.setupAutoBuy();

		await app.position.optimization.adjustAutoBuyTrigger({ value: 0.2 });

		await app.position.optimization.shouldHaveMessage(
			'Please enter a maximum buy price or select Set No Threshold'
		);

		await app.position.optimization.setNoThreshold();
		await app.position.optimization.shouldHaveMessage(
			'You are setting an auto buy trigger with no maximum buy price threshold'
		);

		// Pause needed to avoid random fails
		await app.page.waitForTimeout(4000);

		await app.position.optimization.addAutoBuy();

		// Automation setup randomly fails - Retry until it's set.
		await test.step('Confirm automation setup', async () => {
			await expect(async () => {
				await app.position.setup.confirmOrRetry();
				await test.step('Metamask: ConfirmPermissionToSpend', async () => {
					await metamask.confirmPermissionToSpend();
				});
				await app.position.setup.finishedShouldBeVisible();
			}).toPass({ timeout: longTestTimeout });
		});

		await test.step('Verify tx status - Success', async () => {
			await tenderly.verifyTxReceiptStatusSuccess(forkId);
		});
	});

	test('It should set Auto-Sell on an Aave v3 Mainnet Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.openTab('Protection');
		await app.position.protection.setupAutoSell();
		await app.position.protection.adjustAutoSellTrigger({ value: 0.8 });
		await app.position.protection.shouldHaveMessage(
			'Please enter a minimum sell price or select Set No Threshold'
		);
		await app.position.protection.setNoThreshold();
		await app.position.protection.shouldHaveMessage(
			'You are setting an auto sell trigger with no minimum sell price threshold'
		);

		// Pause needed to avoid random fails
		await app.page.waitForTimeout(5000);

		await app.position.protection.addAutoSell();

		// Automation setup randomly fails - Retry until it's set.
		await test.step('Confirm automation setup', async () => {
			await expect(async () => {
				await app.position.setup.confirmOrRetry();
				await test.step('Metamask: ConfirmPermissionToSpend', async () => {
					await metamask.confirmPermissionToSpend();
				});
				await app.position.setup.finishedShouldBeVisible();
			}).toPass({ timeout: longTestTimeout });
		});

		await test.step('Verify tx status - Success', async () => {
			await tenderly.verifyTxReceiptStatusSuccess(forkId);
		});
	});
});
