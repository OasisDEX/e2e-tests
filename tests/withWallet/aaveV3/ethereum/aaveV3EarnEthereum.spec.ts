import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	extremelyLongTestTimeout,
	baseUrl,
	veryLongTestTimeout,
	longTestTimeout,
} from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should deposit extra collateral on an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13078',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setWstethBalance({ forkId, walletAddress, wstEthBalance: '20' });
		});

		await tenderly.changeAccountOwner({
			account: '0xa15c24213cc3403daee3043c7bf6bddbb44d6251',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/317#overview');

		await app.position.manage.shouldBeVisible('Manage Earn position');

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.enter({ token: 'WSTETH', amount: '20' });
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
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

		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{2}(.[0-9]{1,2})?ETH',
		});
		await app.position.overview.shouldHaveTotalCollateral({ amount: '20.00000', token: 'WSTETH' });
	});

	test('It should withdraw some collateral from an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13109',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Earn position');
		await app.position.overview.shouldHaveTotalCollateral({ amount: '20.00000', token: 'WSTETH' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();
		await app.position.manage.enter({ token: 'WSTETH', amount: '5' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveTotalCollateral({ amount: '15.00000', token: 'WSTETH' });
	});

	test('It should borrow more debt from an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13108',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Earn position');
		await app.position.overview.shouldHaveDebt({ amount: '0.00000', token: 'ETH' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.enter({ token: 'ETH', amount: '5' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveDebt({ amount: '5.00000', token: 'ETH' });
	});

	test('It should pay back some debt from an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13110',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Earn position');
		await app.position.overview.shouldHaveDebt({ amount: '5.00000', token: 'ETH' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();
		await app.position.manage.enter({ token: 'ETH', amount: '2' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveDebt({ amount: '3.00000', token: 'ETH' });
	});

	test('It should adjust risk of an existing Aave V3 Earn Ethereum position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13060',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Earn position');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.7 });

		await app.position.manage.adjustRisk();

		// Risk adjustment randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage Earn position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
	});

	test('It should adjust risk of an existing Aave V3 Earn Ethereum position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13061',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Earn position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.3 });

		await app.position.manage.adjustRisk();

		// Risk adjustment randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage Earn position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
	});

	test('It should close an existing Aave V3 Earn Ethereum position - Close to debt token (ETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13062',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');

		await app.position.manage.closeTo('WSTETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WSTETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
		});

		// Closing position randomly fails - Retry until it's closed.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.page.goto('/ethereum/aave/v3/317#overview');
		await app.position.overview.shouldHaveNetValue({ value: '0ETH' });
		await app.position.overview.shouldHaveTotalCollateral({ amount: '0.00000', token: 'WSTETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.00000', token: 'ETH' });
	});

	test('It should open an Aave V3 Earn Ethereum position @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11715',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});
		await app.position.setup.continue();
		await app.position.setup.openEarnPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test.skip('It should list an opened Aave V3 Earn Ethereum position in portfolio', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11673',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.earn.shouldHaveHeaderCount('1');
		// await app.portfolio.earn.vaults.first.shouldHave({ assets: 'WSTETH/ETH' });
	});

	test.skip('It should open an Aave V3 Earn Ethereum position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11681',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.earn.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage ');
	});
});
