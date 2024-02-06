import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	extremelyLongTestTimeout,
	veryLongTestTimeout,
	longTestTimeout,
	positionTimeout,
} from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Base Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'base',
				walletAddress,
				token: 'USDC',
				balance: '100000',
			});
		});

		await app.page.goto('/base/ajna/multiply/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '15.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{4} WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '1[5-9].[0-9]{1,2}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-2].[0-9]{3,4}',
			token: 'ETH',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]{3,4} WSTETH/ETH',
		});
		// Ajna LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-2].[0-9]{4}',
			token: 'WSTETH',
			dollarsAmount: '[1-9],[0-9]{3}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WSTETH',
			current: '0.00',
			future: '1[5-7].[0-9]{1,2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-2].[0-9]{3,4}',
			percentage: '[0-9].[0-9]{2}',
			protocol: 'Ajna',
			pair: 'WSTETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.50');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '[1-2].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2}.[0-9]{2}',
			future: '[0-9]{2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate risk adjustment (Up & Down) with slider in an Ajna Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue('Ajna');

		// RISK UP
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/ETH' });

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.3 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/ETH' });

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should open an Ajna Ethreum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/base/ajna/multiply/ETH-USDC');
		await app.position.setup.acknowlegeAjnaInfo();

		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
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

		// ======================================================================

		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines

		await app.position.setup.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.setup.shouldShowCreatingPosition();

		await app.page.reload();
		await app.position.setup.goToPosition();

		// ======================================================================

		await app.position.manage.shouldBeVisible('Manage your Ajna Multiply Position');
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.6 });

		await app.position.manage.confirm();

		// ======================================================================

		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines

		await app.position.setup.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.setup.shouldShowUpdatingPosition();

		await app.page.reload();

		// ======================================================================

		await app.position.manage.shouldBeVisible('Manage your Ajna Multiply Position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existing Ajna Base Multiply position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		await app.position.manage.confirm();

		// ======================================================================

		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines

		await app.position.setup.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.setup.shouldShowUpdatingPosition();

		await app.page.reload();

		// ======================================================================

		await app.position.manage.shouldBeVisible('Manage your Ajna Multiply Position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should Close to debt an existing Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('USDC');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'USDC',
			amount: '[0-9]{2},[0-9]{3}.[0-9]{1,2}',
		});

		await app.position.setup.confirm();

		// ============================================================

		// UI sometimes gets stuck after confirming position update
		//   - 'Reload' added to avoid flakines
		await app.position.setup.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.setup.shouldShowUpdatingPosition();
		await app.page.reload();

		// ============================================================

		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00' });
		await app.position.overview.shouldHaveBuyingPower('0.00');
		await app.position.overview.shouldHaveExposure({ token: 'ETH', amount: '0.00' });
		await app.position.overview.shouldHaveDebt({
			amount: '0.00',
			token: 'USDC',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveMultiple('1.00');
	});
});
