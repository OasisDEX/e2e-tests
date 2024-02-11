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
let positionId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11811',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/spark/v3/borrow/ethdai#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '3' });
		await app.position.setup.borrow({ token: 'DAI', amount: '1000' });
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
		positionId = await app.position.setup.getNewPositionId();
		console.log('+++ Position ID: ', positionId);

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should deposit extra collateral on an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11406',
		});

		test.setTimeout(longTestTimeout);

		await expect(async () => {
			await app.position.manage.deposit({ token: 'ETH', amount: '0' });
			await app.position.manage.deposit({ token: 'ETH', amount: '20' });
			await app.position.setup.orderInformation.shouldHaveTransactionFee({
				fee: '0',
				gas: '[0-9].[0-9]{4,5}',
			});
		}).toPass({ intervals: [1_000, 10_000, 10_000], timeout: 30_000 });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveNetValue({
			value: '2[0-3].[0-9]{2}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposure({ amount: '23.00000', token: 'ETH' });
	});

	test('It should withdraw some collateral from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13113',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveExposure({ amount: '23.00000', token: 'ETH' });

		await app.position.manage.withdrawCollateral();
		await app.position.manage.withdraw({ token: 'ETH', amount: '5' });

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
			amount: '18.00000',
			token: 'ETH',
			timeout: positionTimeout,
		});
	});

	test('It should borrow more debt from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13114',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveDebt({ amount: '1,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.borrow({ token: 'DAI', amount: '5000' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveDebt({
			amount: '6,[0-9]{3}.[0-9]{4}',
			token: 'DAI',
			timeout: positionTimeout,
		});
	});

	test('It should pay back some debt from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13115',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveDebt({ amount: '6,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();
		await app.position.manage.payback({ token: 'DAI', amount: '3000' });
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

		await app.position.overview.shouldHaveDebt({
			amount: '3,[0-9]{3}.[0-9]{4}',
			token: 'DAI',
			timeout: positionTimeout,
		});
	});

	test('It should close an existing Spark Borrow position - Close to collateral token (ETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13077',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('ETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
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

		await app.page.goto(positionId);
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });
	});

	test('It should close an existing Spark Borrow position - Close to debt token (DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13052',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to avoid random fails
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x3dc0f12ff0452cab029c3c185c9dc9061d1515c8',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/spark/v3/1474#overview');
		await app.position.manage.shouldBeVisible('Manage Collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('DAI');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'DAI',
			amount: '[0-9].[0-9]{3,4}',
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

		await app.page.goto('/ethereum/spark/v3/1474#overview');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });
	});

	test.skip('It should list an opened Spark Borrow position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11813',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/DAI' });
	});

	test.skip('It should open an Spark Borrow position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11812',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
