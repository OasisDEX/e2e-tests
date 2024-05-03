import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import { expect, metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import * as tx from 'utils/tx';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1600, height: 850 },
	});

	// Create a Maker position as part of the Refinance tests setup
	test('It should open a Maker Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true EnableRefinance:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WBTC',
				balance: '20',
			});
		});

		await app.page.goto('vaults/open/WBTC-C');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'WBTC', amount: '1' });
		await app.position.setup.generate({ token: 'DAI', amount: '30000' });
		await app.position.setup.setupProxy1Of5();
		await app.position.setup.createProxy2Of5();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'WBTC', amount: '1' });
		await app.position.setup.generate({ token: 'DAI', amount: '30000' });

		await app.position.setup.setTokenAllowance('WBTC');
		await app.position.setup.setTokenAllowance('WBTC');
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});
		await app.position.setup.continueShouldBeVisible();
		await app.position.setup.continue();

		await app.position.setup.confirm();
		await app.position.setup.continueWithoutStopLoss();
		await app.position.setup.createVault3Of3();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		await app.position.setup.goToVault();
		await app.position.manage.shouldBeVisible('Manage your vault');
		// Verify that it has beenopened as 'Borrow' type
		await app.position.manage.shouldHaveButton({ label: 'WBTC' });
	});

	test('It should refinance a Maker Borrow position (WBTC/DAI) to Spark Borrow (WBTC/DAI) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(veryLongTestTimeout);

		// Wait an reload to avoid flakiness
		await app.page.waitForTimeout(1000);
		const originalPositionPage: string = app.page.url();
		await app.page.reload();

		await app.position.overview.refinance();
		await app.position.refinance.selectReason('Switch to higher max Loan To Value');
		await app.position.refinance.productList.first.open();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();
		await app.position.refinance.shouldHaveMaxTransactionCost();
		await app.position.refinance.confirm();
		await test.step('Confirm automation setup', async () => {
			await expect(async () => {
				await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
				await app.position.setup.continueShouldBeVisible();
			}).toPass();
		});

		await app.position.setup.continue();
		await app.position.refinance.confirm();
		await test.step('Confirm automation setup', async () => {
			await expect(async () => {
				await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
				await app.position.setup.goToPositionShouldBeVisible();
			}).toPass();
		});

		await app.position.setup.goToPosition();

		await app.position.manage.shouldBeVisible('Manage your Spark');
		await app.position.overview.shouldHaveExposure({ amount: '1.0000', token: 'WBTC' });
		await app.position.overview.shouldHaveDebt({ amount: '30,000.00', token: 'DAI' });

		// Verify that original Maker position is now empty
		await app.page.goto(originalPositionPage);
		await app.position.manage.shouldBeVisible('Manage your vault');
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
		await app.position.overview.shouldHaveCollateralizationRatio('0.00');
		await app.position.overview.shouldHaveCollateralLocked('0.00');
		await app.position.overview.shouldHaveVaultDaiDebt('0.0000');
		await app.position.overview.shouldHaveAvailableToWithdraw({ amount: '0.00000', token: 'WBTC' });
		await app.position.overview.shouldHaveAvailableToGenerate({ amount: '0.0000', token: 'DAI' });
	});
});
