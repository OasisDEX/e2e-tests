import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, testTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 - Wallet connected', async () => {
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

	test('It should open an Aave v3 Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11682',
		});

		test.setTimeout(testTimeout);

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

		// Position creation randomly fails - Retyr until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test('It should list an opened Aave v3 Borrow position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11673',
		});

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);

		await app.header.shouldHavePortfolioCount('1');
		await app.portfolio.borrow.shouldHaveHeaderCount('1');
		await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test('It should open an Aave v3 Borrow position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11681',
		});

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.borrow.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});

	test.skip('It should open an Aave v3 Earn position', async () => {
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

		test.setTimeout(testTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();
		await app.position.setup.openEarnPosition1Of2();

		// Position creation randomly fails - Retyr until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test.skip('It should list an opened Aave v3 Earn position in portfolio', async () => {
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

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);

		await app.portfolio.earn.shouldHaveHeaderCount('1');
		await app.portfolio.earn.vaults.first.shouldHave({ assets: 'WSTETH/ETH' });
	});

	test.skip('It should open an Aave v3 Earn position from portfolio page', async () => {
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

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.earn.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage Earn position');
	});

	test('It should open an Aave v3 Multiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11769',
		});

		test.setTimeout(testTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await metamask.confirmAddToken();
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();
		await app.position.setup.setupStopLoss1Of3();
		await app.position.setup.confirm(); // Stop-Loss 2/3
		await app.position.setup.confirm(); // Stop-Loss 3/3
		await metamask.confirmPermissionToSpend();
		await app.position.setup.setupStopLossTransaction();
		await metamask.confirmPermissionToSpend();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});

	test.skip('It should list an opened Aave v3 Multiply position in portfolio', async () => {
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

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);

		await app.portfolio.multiply.shouldHaveHeaderCount('1');
		await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test.skip('It should open an Aave v3 Multiply position from portfolio page', async () => {
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

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.multiply.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});

	test('It should open an Aave v2 Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(testTimeout);

		await app.page.goto('/ethereum/aave/v2/earn/stETHeth');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.09' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();
		await app.position.setup.openEarnPosition1Of2();

		// Position creation randomly fails - Retyr until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage Earn ');
	});

	test('It should open an Aave v2 Multiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11773',
		});

		test.setTimeout(testTimeout);

		await app.page.goto('/ethereum/aave/v2/multiply/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await metamask.confirmAddToken();
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();
		await app.position.setup.openMultiplyPosition1Of2();
		await app.position.setup.confirm(); // Stop-Loss 2/2
		await metamask.confirmPermissionToSpend();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});
});
