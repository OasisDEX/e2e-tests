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

test.describe('Ajna Ethereum Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Ethereum Borrow position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12732',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'WSTETH',
				balance: '100',
			});
		});

		await app.page.goto('/ethereum/ajna/borrow/RETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'RETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 RETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '10.12',
			token: 'RETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'RETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'RETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'ETH', amount: '8.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-3].[0-9]{3,4} RETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[4-9][0-9].[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '8.1234',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[1-5].[0-9]{3,4}',
			token: 'RETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[1-5].[0-9]{3,4}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveOriginationFee({
			token: 'ETH',
			tokenAmount: '0.[0-9]{4}',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'RETH/ETH',
			current: '0.00',
			future: '[0-2].[0-9]{3,4}',
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
			token: 'ETH',
			current: '0.00',
			future: '8.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'RETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
	});

	test('It should open an Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12103',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '20' });
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

	test('It should Deposit and Borrow in a single tx form an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.setup.deposit({ token: 'WSTETH', amount: '15' });
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
			token: 'WSTETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '25.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Withdraw and Pay back in a single tx form an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();
		await app.position.manage.withdraw({ token: 'WSTETH', amount: '10' });
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
			token: 'WSTETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '20.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.borrow({ token: 'ETH', amount: '15' });
		await app.position.manage.deposit({ token: 'WSTETH', amount: '20' });

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
			token: 'WSTETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '35.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.payBackDebt();
		await app.position.manage.payback({ token: 'ETH', amount: '20' });
		await app.position.manage.withdraw({ token: 'WSTETH', amount: '15' });

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
			token: 'WSTETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '15.[0-9]{2}([0-9]{1,2})?',
			token: 'ETH',
			protocol: 'Ajna',
		});
	});

	test('It should Close to collateral an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Close position');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WSTETH',
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
		await app.position.overview.shouldHaveCollateralDeposited({ amount: '0.00', token: 'WSTETH' });
		await app.position.overview.shouldHaveDebt({
			amount: '0.00',
			token: 'ETH',
			protocol: 'Ajna',
		});
		await app.position.overview.shouldHaveNetValue({ value: '0.00' });
		await app.position.overview.shouldHaveAvailableToWithdraw({ token: 'WSTETH', amount: '0.00' });
		await app.position.overview.shouldHaveAvailableToBorrow({ token: 'ETH', amount: '0.00' });
	});
});
