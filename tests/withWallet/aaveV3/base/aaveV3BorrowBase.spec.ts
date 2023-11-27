import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, baseUrl, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should adjust risk of an existent Aave V3 Borrow Base position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13065',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x94a7bf1ba459f3895e3936c4c6bc32eea266fc21',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/base/aave/v3/2#overview');

		await app.position.manage.shouldBeVisible('Manage collateral');

		await test.step('Adding some collateral to empty position', async () => {
			await app.position.manage.enter({ token: 'ETH', amount: '15' });

			await app.position.manage.confirm();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
			await app.position.manage.ok();
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.7 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existent Aave V3 Borrow Base position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13066',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.3 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should close an existent Aave V3 Borrow Base position - Close to collateral token (CBETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13067',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('ETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
		});
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});

		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.page.goto('/base/aave/v3/2#overview');
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'USDBC' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'USDBC' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'USDBC' });
	});

	test('It should open an Aave V3 Borrow Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12473',
		});

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/base/aave/v3/borrow/ethusdbc#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '9.12345' });
		await app.position.setup.borrow({ token: 'USDBC', amount: '2000' });
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
		await app.position.setup.openBorrowPosition1Of2();

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
