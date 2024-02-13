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

test.describe('Ajna Base Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Base Borrow position before opening it @regression', async () => {
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
				token: 'CBETH',
				balance: '100',
			});
		});

		await app.page.goto('/base/ajna/borrow/ETH-USDC#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 ETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '10.12',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDC',
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'USDC', amount: '10,000.12' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-3],[0-9]{3}.[0-9]{2} ETH/USDC'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[2-7][0-9].[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '10,000.12',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[2-6].[0-9]{3,4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
			token: 'USDC',
		});

		await app.position.setup.shouldHaveOriginationFee({
			token: 'USDC',
			tokenAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'ETH/USDC',
			current: '0.00',
			future: '([1-2],)?[0-9]{3}.[0-9]{1,2}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Ajna',
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '10,0[0-9]{2}.[0-9]{1,2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'ETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
	});

	test('It should open an Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/base/ajna/borrow/CBETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'CBETH', amount: '20' });
		await app.position.setup.borrow({ token: 'ETH', amount: '15' });

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
			await app.position.setup.approveAllowance();
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

		await app.position.manage.shouldBeVisible('Manage your Ajna Borrow Position');
	});

	test('It should Deposit and Borrow in a single tx form an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.setup.deposit({ token: 'CBETH', amount: '15' });
		await app.position.setup.borrow({ token: 'ETH', amount: '10' });

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

		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '35.00',
			token: 'CBETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '25.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Withdraw and Pay back in a single tx form an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();
		await app.position.manage.withdraw({ token: 'CBETH', amount: '10' });
		await app.position.manage.payback({ token: 'ETH', amount: '5' });

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

		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '25.00',
			token: 'CBETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '20.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.borrow({ token: 'ETH', amount: '15' });
		await app.position.manage.deposit({ token: 'CBETH', amount: '20' });

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

		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '45.00',
			token: 'CBETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '35.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.payBackDebt();
		await app.position.manage.payback({ token: 'ETH', amount: '20' });
		await app.position.manage.withdraw({ token: 'CBETH', amount: '15' });

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

		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '30.00',
			token: 'CBETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '15.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Close to collateral an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Close position');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'CBETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
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
		await app.position.overview.shouldHaveCollateralDeposited({ amount: '0.00', token: 'CBETH' });
		await app.position.overview.shouldHaveDebt({
			amount: '0.00',
			token: 'ETH',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveNetValue({ value: '0.00' });
		await app.position.overview.shouldHaveAvailableToWithdraw({ token: 'CBETH', amount: '0.00' });
		await app.position.overview.shouldHaveAvailableToBorrow({ token: 'ETH', amount: '0.00' });
	});
});
