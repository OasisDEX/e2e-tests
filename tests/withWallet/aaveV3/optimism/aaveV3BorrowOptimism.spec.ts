import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
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

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Optimism position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12069',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'optimism' }));
		});

		await app.page.goto('/optimism/aave/v3/borrow/ethusdc');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '6.12345' });
		await app.position.setup.borrow({ token: 'USDC', amount: '2000' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});
		await app.position.setup.continue();
		await app.position.setup.openBorrowPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		// Logging position ID for debugging purposes
		const positionId = await app.position.setup.getNewPositionId();
		console.log('+++ Position ID: ', positionId);

		await app.position.setup.goToPosition();
		// Verify that positionhas been logged as Borrow
		await app.position.manage.shouldHaveButton({ label: 'Manage ETH' });
	});

	test('It should adjust risk of an existent Aave V3 Borrow Optimism position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12912',
		});

		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x1a7ab3359598aa32dbd04edbfa95600f43d89f14',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/4#overview');

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage DAI' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.3 });

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

		// Wait for liq price to update
		await expect(async () => {
			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
		}).toPass();
	});

	test('It should adjust risk of an existent Aave V3 Borrow Optimism position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12913',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
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

		// Wait for liq price to update
		await expect(async () => {
			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		}).toPass();
	});

	test('It should close an existent Aave V3 Borrow Optimism position - Close to collateral token (DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12914',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('WBTC');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WBTC',
			amount: '<0.001',
		});

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.page.goto('/optimism/aave/v3/4#overview');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({ amount: '0.0000', token: 'DAI' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'WBTC' });
	});
});
