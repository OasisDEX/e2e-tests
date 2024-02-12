import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	extremelyLongTestTimeout,
	longTestTimeout,
	positionTimeout,
	veryLongTestTimeout,
} from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Borrow and Deposit in a single tx from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13661',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x3dc0f12ff0452cab029c3c185c9dc9061d1515c8',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/spark/v3/1474#overview');
		// Wait for all position data to be loaded
		await app.position.shouldHaveTab('Protection ON');

		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.borrow({ token: 'DAI', amount: '20000' });
		await app.position.manage.deposit({ token: 'ETH', amount: '30' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: veryLongTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({
			amount: '30.[0-9]{5}',
			token: 'ETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '20,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});

	test('It should Pay back and Withdraw in a single tx from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13662',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldHaveButton({ label: 'Adjust' });
		await app.position.overview.shouldHaveExposure({ amount: '30.[0-9]{5}', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '20,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();
		await app.position.manage.payback({ token: 'DAI', amount: '5000' });
		await app.position.manage.withdraw({ token: 'ETH', amount: '2' });
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

		await app.position.overview.shouldHaveExposure({
			amount: '2[7-8].[0-9]{5}',
			token: 'ETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '15,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});

	test('It should adjust risk of an existent Spark Borrow position - Up (ETH/DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13050',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldHaveButton({ label: 'Adjust' });

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.6 });

		await app.position.manage.adjustRisk();

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.manage.shouldHaveButton({ label: 'Adjust' });

		// Waitfor liq price to update
		await expect(async () => {
			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		}).toPass();
	});
});
