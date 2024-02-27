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

test.describe('Aave V3 Borrow - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11682',
		});

		test.setTimeout(extremelyLongTestTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'CBETH',
			balance: '50',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/cbetheth#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'CBETH', amount: '7.5' });
		await app.position.setup.borrow({ token: 'ETH', amount: '3' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});
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
		// SKIPPING POSITION TYPE VERIFICATION due to db collision being back
		// // Verify that it has been logged as a Borrow position
		// await app.position.manage.shouldHaveButton({ label: 'Manage CBETH', timeout: positionTimeout });
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should adjust risk of an existent Aave V3 Borrow Ethereum position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12058',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage CBETH' });
		await app.position.manage.select('Adjust');

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
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		}).toPass();
	});

	test('It should adjust risk of an existent Aave V3 Borrow Ethereum position - Down', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12059',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldHaveButton({ label: 'Adjust' });
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
			expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
		}).toPass();
	});

	test('It should close an existent Aave V3 Borrow Ethereum position - Close to collateral token (CBETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12060',
		});

		test.setTimeout(veryLongTestTimeout);

		// Getting position page url before closing position
		await app.position.manage.shouldHaveButton({ label: 'Adjust' });
		const positionPage = app.page.url();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('CBETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'CBETH',
			amount: '[4-7].[0-9]{3,4}',
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

		await app.page.goto(positionPage);

		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'CBETH/ETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveCollateralDeposited({ amount: '0.00', token: 'CBETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0', token: 'ETH' });
		await app.position.overview.shouldHaveNetValue({ value: '\\$0.00' });
	});

	test.skip('It should list an opened Aave V3 Borrow Ethereum position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11673',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test.skip('It should open an Aave V3 Borrow Ethereum position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11681',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
