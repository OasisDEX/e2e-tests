import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, positionTimeout } from 'utils/config';
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

	test('It should adjust risk of an existent Aave V3 Multiply Base position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12465',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));
		});

		await tenderly.changeAccountOwner({
			account: '0xf5922d700883214f689efe190a978ac51c50e6b1',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/base/aave/v3/17#overview');

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.2 });

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

		await app.position.manage.shouldBeVisible('Manage Multiply position');

		// Wait for Liq price to update
		await expect(async () => {
			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
		}).toPass();
	});

	test('It should adjust risk of an existent Aave V3 Multiply Base position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12464',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.7 });

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

		await app.position.manage.shouldBeVisible('Manage Multiply position');

		// Wait for Liq price to update
		await expect(async () => {
			const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
			const updatedLoanToValue = await app.position.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		}).toPass();
	});

	test('It should close an existent Aave V3 Multiply Base position - Close to debt token (USDBC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12466',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('USDBC');

		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'USDBC',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
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

		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'ETH/USDBC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '\\$0.00' });
		await app.position.overview.shouldHaveBuyingPower('\\$0.00');
		await app.position.overview.shouldHaveExposure({ amount: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.00', token: 'USDBC' });
		await app.position.overview.shouldHaveMultiple('1.00');
	});

	test('It should open an Aave v3 Multiply Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
		});

		test.setTimeout(extremelyLongTestTimeout);
		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'base',
			token: 'CBETH',
			balance: '50',
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
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
		await app.position.setup.openMultiplyPosition1Of2();

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
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test.skip('It should list an opened Aave v3 Multiply Base position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12467',
		});

		test.setTimeout(longTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.multiply.shouldHaveHeaderCount('1');
		// await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'CBETH/USDBC' });
	});

	test.skip('It should open an Aave v3 Multiply Base position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12468',
		});

		test.setTimeout(longTestTimeout);

		// await app.portfolio.multiply.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
