import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { expect, metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import * as tx from 'utils/tx';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe.only('Maker Borrow - Wallet connected', async () => {
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
	test('It should open a Maker Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true EnableRefinance:true',
			}));
		});

		await app.page.goto('/vaults/open/ETH-C');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			generate: { token: 'DAI', amount: '15000' },
		});
	});

	test('It should refinance a Maker Borrow position (ETH/DAI) to Spark Borrow (RETH/DAI)', async () => {
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
		await app.position.refinance.selectReason('Switch to lower my cost');
		await app.position.refinance.productList.byPairPool('RETH/DAI').open();

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
		await app.position.overview.shouldHaveExposure({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'RETH',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '[1][4-5],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});

		// Verify that original Maker position is now empty
		await app.page.goto(originalPositionPage);
		await app.position.manage.shouldBeVisible('Manage your vault');
		await app.position.overview.shouldHaveLiquidationPrice({ price: '0.00' });
		await app.position.overview.shouldHaveCollateralizationRatio('0.00');
		await app.position.overview.shouldHaveCollateralLocked('0.00');
		await app.position.overview.shouldHaveVaultDaiDebt('0.0000');
		await app.position.overview.shouldHaveAvailableToWithdraw({ amount: '0.00000', token: 'ETH' });
		await app.position.overview.shouldHaveAvailableToGenerate({ amount: '0.0000', token: 'DAI' });
	});
});
