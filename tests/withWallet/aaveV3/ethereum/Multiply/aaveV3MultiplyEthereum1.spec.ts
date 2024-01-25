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

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11769',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setDaiBalance({ forkId, walletAddress, daiBalance: '30000' });
		});

		await app.page.goto('/ethereum/aave/v3/multiply/daiwbtc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'DAI', amount: '15000.1234' });
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
		await app.position.manage.shouldBeVisible('Manage Multiply position');
	});

	test('It should close an existent Aave V3 Multiply Ethereum position - Close to debt token (WBTC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12057',
		});

		test.setTimeout(veryLongTestTimeout);

		// Getting position page url before closing position
		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const positionPage = app.page.url();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');

		await app.position.manage.closeTo('WBTC');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WBTC',
			amount: '[0-1].[0-9]{3,4}',
		});

		// Transaction randomly fails - Retry until it's completed.
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
			token: 'DAI',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({ amount: '0.0000', token: 'DAI' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'WBTC' });
		await app.position.overview.shouldHaveMultiple('1');
		await app.position.overview.shouldHaveBuyingPower('0.00');
	});

	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12055',
		});

		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/1218#overview');

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.9 });

		await app.position.manage.adjustRisk();

		// Transaction randomly fails - Retry until it's completed.
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

	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12056',
		});

		test.setTimeout(veryLongTestTimeout);
		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
			await tenderly.setEthBalance({ forkId, walletAddress, ethBalance: '100' });
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/1218#overview');

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.3 });

		await app.position.manage.adjustRisk();

		// Transaction randomly fails - Retry until it's completed.
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

	test.skip('It should list an opened Aave v3 Multiply Ethereum position in portfolio', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11770',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.multiply.shouldHaveHeaderCount('1');
		// await app.portfolio.vaults.first.shouldHave({ assets: 'DAI/WBTC' });
	});

	test.skip('It should open an Aave v3 Multiply Ethereum position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11771',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(veryLongTestTimeout);

		// await app.portfolio.multiply.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
