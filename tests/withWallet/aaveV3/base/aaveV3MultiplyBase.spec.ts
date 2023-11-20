import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setCbEthBalance({ forkId, cbEthBalance: '50' });
		});

		await app.page.goto('/base/aave/v3/multiply/cbethusdbc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'CBETH', amount: '14.12345' });
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

	test.skip('It should adjust risk of an existent Aave V3 Multiply Base position - Up @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12464',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.5 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Borrow' when using fork.
	test.skip('It should adjust risk of an existent Aave V3 Multiply Base position - Down @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12465',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
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

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Borrow' when using fork.
	test.skip('It should close an existent Aave V3 Multiply Base position - Close to debt token (WBTC) @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12466',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('CBETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'CBETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
		});
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});

		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'USDBC' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'USDBC' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'CBETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'USDBC' });
		await app.position.overview.shouldHaveMultiple('1');
		await app.position.overview.shouldHaveBuyingPower('0.00');
	});

	test.skip('It should list an opened Aave v3 Multiply Base position in portfolio', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12467',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(longTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.multiply.shouldHaveHeaderCount('1');
		// await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'CBETH/USDBC' });
	});

	test.skip('It should open an Aave v3 Multiply Base position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12468',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(longTestTimeout);

		// await app.portfolio.multiply.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
