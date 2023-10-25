import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
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

			await tenderly.setDaiBalance({ forkId, daiBalance: '30000' });
		});

		await app.page.goto('/ethereum/aave/v3/multiply/daiwbtc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'DAI', amount: '15000.1234' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await metamask.confirmAddToken();
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await metamask.confirmAddToken();
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();

		await app.position.setup.openMultiplyPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage multiply');
	});

	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12055',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ protocol: 'Aave V3', value: 0.5 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Borrow' when using fork.
	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12056',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ protocol: 'Aave V3', value: 0.3 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Borrow' when using fork.
	test('It should close an existent Aave V3 Multiply Ethereum position - Close to debt token (WBTC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12057',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('WBTC');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WBTC',
			amount: '[0-2].[0-9]{1,4}',
		});
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();

		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({ amount: '0.0000', token: 'DAI' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'WBTC' });
		await app.position.overview.shouldHaveMultiple('1');
		await app.position.overview.shouldHaveBuyingPower('0.00');
	});

	test('It should list an opened Aave v3 Multiply Ethereum position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11770',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto(`/owner/${walletAddress}`);

		await app.portfolio.multiply.shouldHaveHeaderCount('1');
		await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'DAI/WBTC' });
	});

	test('It should open an Aave v3 Multiply Ethereum position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11771',
		});

		test.setTimeout(longTestTimeout);

		await app.portfolio.multiply.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
