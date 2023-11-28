import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { baseUrl, extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should adjust risk of an existent Spark Borrow position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13050',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x3dc0f12ff0452cab029c3c185c9dc9061d1515c8',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/spark/v3/1474#overview');
		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.6 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existent Spark Borrow position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13051',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
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

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should close an existent Spark Borrow position - Close to debt token (DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13052',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('DAI');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'DAI',
			amount: '0.[0-9]{3,4}',
		});
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});

		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.page.goto('/ethereum/spark/v3/1474#overview');
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });
	});

	test('It should open a Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11811',
		});

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/v3/borrow/ethdai#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '3' });
		await app.position.setup.borrow({ token: 'DAI', amount: '1' });
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
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should deposit extra collateral on an existent Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11406',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// New fork needed
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
			await tenderly.setEthBalance({ forkId, ethBalance: '20' });
			await tenderly.setWbtcBalance({ forkId, wbtcBalance: '2' });
		});

		await tenderly.changeAccountOwner({
			account: '0x648dd9e11414db57097903a3ed98f773af61ef09',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/spark/v3/1669#overview');
		await app.position.manage.shouldBeVisible('Manage collateral');

		await app.position.manage.enter({ token: 'WBTC', amount: '1' });

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
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{2},[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveExposure({ amount: '1.00000', token: 'WBTC' });
	});

	test('It should withdraw some collateral from an existent Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13113',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveExposure({ amount: '1.00000', token: 'WBTC' });

		await app.position.manage.withdrawCollateral();
		await app.position.manage.enter({ token: 'WBTC', amount: '0.1' });
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({ amount: '0.90000', token: 'WBTC' });
	});

	test('It should borrow more debt from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13114',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Manage WBTC' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.enter({ token: 'DAI', amount: '5000' });
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveDebt({ amount: '5,000.0000', token: 'DAI' });
	});

	test('It should pay back some debt from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13115',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Manage WBTC' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();
		await app.position.manage.enter({ token: 'DAI', amount: '3000' });
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
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveDebt({ amount: '2,000.[0-9]{4}', token: 'DAI' });
	});

	test('It should adjust risk of an existent Spark Borrow position - Up (WBTC/DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13050',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage WBTC' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.6 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage WBTC' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existent Spark Borrow position - Down (WBTC/DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13051',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
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

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage WBTC' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should close an existent Spark Borrow position - Close to collateral token (WBTC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13077',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('WBTC');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WBTC',
			amount: '0.[0-9]{3,4}',
		});
		await app.position.manage.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});

		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.page.goto('/ethereum/spark/v3/1669#overview');
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'WBTC' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'DAI' });
	});

	test.skip('It should list an opened Spark Borrow position in portfolio', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11813',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/DAI' });
	});

	test.skip('It should open an Spark Borrow position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11812',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
