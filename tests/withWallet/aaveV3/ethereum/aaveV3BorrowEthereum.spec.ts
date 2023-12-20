import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	baseUrl,
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

test.describe('Aave V3 Borrow - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11682',
		});

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '7.5' });
		await app.position.setup.borrow({ token: 'USDC', amount: '2000' });
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

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should adjust risk of an existent Aave V3 Borrow Ethereum position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12058',
		});

		if (baseUrl.includes('staging') || baseUrl.includes('//summer.fi')) {
			test.setTimeout(extremelyLongTestTimeout);

			await test.step('Test setup', async () => {
				({ context } = await metamaskSetUp({ network: 'mainnet' }));
				let page = await context.newPage();
				app = new App(page);

				({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
			});
		} else {
			test.setTimeout(veryLongTestTimeout);
		}

		await tenderly.changeAccountOwner({
			account: '0x683ab4100c253ddca342772501775bb87340551b',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/1277#overview');

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage CBETH' });
		await app.position.manage.select('Adjust');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		await app.position.manage.waitForSliderToBeEditable();
		await app.position.manage.moveSlider({ value: 0.5 });

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

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage CBETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
	});

	test('It should adjust risk of an existent Aave V3 Borrow Ethereum position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12059',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
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

		await app.position.manage.shouldBeVisible('Manage collateral');
		await app.position.manage.openManageOptions({ currentLabel: 'Manage CBETH' });
		await app.position.manage.select('Adjust');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();

		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
	});

	test('It should close an existent Aave V3 Borrow Ethereum position - Close to collateral token (CBETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12060',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Borrow position');
		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.closeTo('CBETH');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'CBETH',
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

		await app.page.goto('/ethereum/aave/v3/1277#overview');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			token: 'ETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveBorrowCost('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00', token: 'ETH' });
		await app.position.overview.shouldHaveExposure({ amount: '0.00000', token: 'CBETH' });
		await app.position.overview.shouldHaveDebt({ amount: '0.0000', token: 'ETH' });
	});

	test.skip('It should list an opened Aave V3 Borrow Ethereum position in portfolio', async () => {
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

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test.skip('It should open an Aave V3 Borrow Ethereum position from portfolio page', async () => {
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
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
