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

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Optimism position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12067',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'optimism' }));
		});

		await app.page.goto('/optimism/aave/v3/multiply/ethusdc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.12345' });
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
		await app.position.setup.openMultiplyPosition1Of2();

		// Confirm action randomly fails - Retry until it's applied.
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
		await app.position.manage.shouldBeVisible('Manage Multiply position');
	});

	test('It should adjust risk of an existent Aave V3 Multiply Optimism position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12909',
		});

		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/2#overview');

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.9 });

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
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existent Aave V3 Multiply Optimism position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12910',
		});

		test.setTimeout(veryLongTestTimeout);
		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'optimism' }));
			await tenderly.setEthBalance({ forkId, walletAddress, ethBalance: '100' });
		});

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/2#overview');

		await app.position.manage.shouldBeVisible('Manage Multiply position');
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

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should close an existent Aave V3 Multiply Optimism position - Close to collateral token (ETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12911',
		});

		test.setTimeout(veryLongTestTimeout);
		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'optimism' }));
			await tenderly.setEthBalance({ forkId, walletAddress, ethBalance: '100' });
		});

		await tenderly.changeAccountOwner({
			account: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/2#overview');

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');

		await app.position.manage.closeTo('ETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'ETH',
			amount: '0.[0-9]{3,4}',
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

		await app.page.goto('/optimism/aave/v3/2#overview');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'USDC',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'USDC' });
		await app.position.overview.shouldHaveMultiple('1');
		await app.position.overview.shouldHaveBuyingPower('0.00');
	});
});
