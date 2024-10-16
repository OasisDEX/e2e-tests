import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Multiply ETH-B/DAI position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11797, 11798',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true',
			}));
		});

		await app.page.goto('/vaults/open-multiply/ETH-B');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });

		await app.position.setup.setupProxy1Of4();

		await expect(async () => {
			await app.position.setup.createOrRetry();
			// await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await confirmAddToken({ app });
		}).toPass();

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });

		await app.position.setup.confirm();
		await app.position.setup.continueWithoutStopLoss();

		await expect(async () => {
			await app.position.setup.createOrRetry();
			// await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmAddToken' });
			await confirmAddToken({ app });
			await app.position.setup.goToVaultShouldBeVisible();
		}).toPass();

		await app.position.setup.goToVault();
		await app.position.manage.shouldBeVisible('Manage your vault');
		// Verify that it has beenopened as 'Multiply' type
		await app.position.manage.shouldHaveButton({ label: 'Adjust' });
	});

	test('It should switch a Maker Multiply position to Borrow interface', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Switch to Borrow');
		await app.position.manage.goToBorrowInterface();
		await app.position.manage.takeMeToTheBorrowInterface();

		await app.position.overview.shouldHaveAvailableToGenerate({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{3,4}',
			token: 'DAI',
			timeout: expectDefaultTimeout * 5,
		});
	});

	test('It should switch a Maker Multiply position (from Borrow) back to Multiply interface', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Switch to Multiply');
		await app.position.manage.multiplyThisVault();
		await app.position.manage.takeMeToTheMultiplyInterface();

		await app.position.overview.shouldHaveMultiple('[0-9](.[0-9]{1,2})?');
	});

	test('It should allow to simulate a Maker Multiply position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12573',
		});

		test.setTimeout(longTestTimeout);

		await app.position.openPage('/vaults/open-multiply/WSTETH-A', { positionType: 'Maker' });

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'WSTETH', amount: '20.12345' });
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2,3},[0-9]{3}.[0-9]{2}',
			protocol: 'Maker',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveVaultDaiDebtAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{4}');
		await app.position.overview.shouldHaveTotalCollateral({
			token: 'WSTETH',
			amount: '[0-9]{2}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '\\$([0-9],)?[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.setup.shouldHaveCollateralRatio({
			current: '0',
			future: '[0-9]{3}',
		});
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-9].[0-9]{4}',
			token: 'WSTETH',
			dollarsAmount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			protocol: 'Maker',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WSTETH',
			current: '0.00',
			future: '[2-6][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-4],[0-9]{3}.[0-9]{2}',
			percentage: '[0-5].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '0.00',
			future: '[1-2].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'DAI',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralRatio({
			current: '0.00',
			future: '[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveFees('[0-9]{1,2}(.[0-9]{1,2})?');
	});
});
