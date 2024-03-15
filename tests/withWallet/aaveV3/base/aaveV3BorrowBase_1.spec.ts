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

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12473',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'base' }));
		});

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
		// +++ Skipping 'position type'verificationdue to 'db collision' being back
		// await app.position.manage.shouldHaveButton({ label: 'Manage ETH', timeout: positionTimeout });
		await app.position.manage.shouldBeVisible('Manage ');
	});

	// Skipped because of DB collision issue on staging
	test.skip('It should deposit extra collateral on an existent Aave V3 Borrow Base position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13035',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldHaveButton({ label: 'Manage ETH' });
		await app.position.manage.deposit({ token: 'ETH', amount: '1' });

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
			value: '\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '10.[0-9]{2}',
			token: 'ETH',
		});
	});

	// Skipped because of DB collision issue on staging
	test.skip('It should close an existent Aave V3 Borrow Base position - Close to collateral token (CBETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13067',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldHaveButton({ label: 'Adjust' });
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('ETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'ETH',
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

		await app.page.goto('/base/aave/v3/2#overview');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'ETH/USDBC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '\\$0.00' });
		await app.position.overview.shouldHaveCollateralDeposited({ amount: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.00', token: 'USDBC' });
	});
});
