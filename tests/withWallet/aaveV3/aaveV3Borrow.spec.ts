import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Borrow - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp());
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup(app));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11682',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '7.5' });
		await app.position.setup.borrow({ token: 'USDC', amount: '2000' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();
		await app.position.setup.openBorrowPosition1Of2();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	// Position sometimes logged in environment db as 'Multiply' when using fork.
	test.skip('It should adjust risk of an existent Aave V3 Borrow position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12055',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ process: 'manage', value: 0.5 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Multiply' when using fork.
	test.skip('It should adjust risk of an existent Aave V3 Borrow position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12056',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ process: 'manage', value: 0.3 });

		await app.position.manage.adjustRisk();
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();
		await app.position.manage.shouldShowSuccessScreen();
		await app.position.manage.ok();

		await app.position.manage.shouldBeVisible('Manage collateral');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	// Position sometimes logged in environment db as 'Multiply' when using fork.
	test.skip('It should close an existent Aave V3 Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12057',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Manage ETH' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('ETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{2,4}',
		});
		await app.position.manage.confirm();
		await metamask.confirmPermissionToSpend();

		await app.position.manage.shouldShowSuccessScreen();

		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00', token: 'USDC' });
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'USDC' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'USDC' });
	});

	test.skip('It should list an opened Aave v3 Borrow position in portfolio', async () => {
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

		await app.page.goto(`/owner/${walletAddress}`);

		await app.header.shouldHavePortfolioCount('1');
		await app.portfolio.borrow.shouldHaveHeaderCount('1');
		await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test.skip('It should open an Aave v3 Borrow position from portfolio page', async () => {
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

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.borrow.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
