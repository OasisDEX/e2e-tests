import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let app: App;
let vtId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

// SKIP - TO BE IMPROVED - Creating proxy needs to change gas setiings to market or aggressive
test.describe.skip('Maker Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags: 'MakerTenderly:true',
		}));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage a Maker Multiply ETH-B/DAI position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/vaults/open-multiply/ETH-B');

		await test.step('Open position', async () => {
			// Depositing collateral too quickly after loading page returns wrong simulation results
			await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
			await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });

			await app.position.setup.setupProxy1Of4();

			await expect(async () => {
				await app.position.setup.createOrRetry();
				await confirmAddToken({ metamask, app });
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
				await confirmAddToken({ metamask, app });
				await app.position.setup.goToVaultShouldBeVisible();
			}).toPass();

			await app.position.setup.goToVault();
			await app.position.manage.shouldBeVisible('Manage your vault');
			// Verify that it has beenopened as 'Multiply' type
			await app.position.manage.shouldHaveButton({ label: 'Adjust' });
		});

		await test.step('Swith to Borrow', async () => {
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

		await test.step('Swith back to Multiply', async () => {
			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Switch to Multiply');
			await app.position.manage.multiplyThisVault();
			await app.position.manage.takeMeToTheMultiplyInterface();

			await app.position.overview.shouldHaveMultiple('[0-9](.[0-9]{1,2})?');
		});
	});
});

test.describe('Maker Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		await setup({ metamask, app, network: 'mainnet', withoutFork: true });
	});

	test('It should allow to simulate a Maker Multiply position before opening it', async () => {
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
