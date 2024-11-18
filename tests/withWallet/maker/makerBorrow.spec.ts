import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Maker Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		await setup({
			metamask,
			app,
			network: 'mainnet',
			withoutFork: true,
		});
	});

	test('It should allow to simulate a Maker Borrow position before opening it @regression', async () => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/vaults/open/ETH-C');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '10.12345' });
		await app.position.overview.shouldHaveCollateralLockedAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[0-9]{1,2}.[0-9]{5}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToGenerateAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{4}',
			token: 'DAI',
		});
		await app.position.setup.vaultChanges.shouldHaveCollateralLocked({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.vaultChanges.shouldHaveAvailableToWithdraw({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.vaultChanges.shouldHaveAvailableToGenerate({
			token: 'DAI',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.vaultChanges.shouldHaveMaxGasFee('n/a');

		await app.position.setup.generate({ token: 'DAI', amount: '8,000.12' });
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-2],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveCollateralizationRatioAfterPill('[0-9]{3}.[0-9]{2}%');
		await app.position.overview.shouldHaveVaultDaiDebtAfterPill('8,000.1200');
		await app.position.setup.vaultChanges.shouldHaveCollateralizationRatio({
			current: '0.00',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.vaultChanges.shouldHaveLiquidationPrice({
			current: '0.00',
			future: '([0-9],)?[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.vaultChanges.shouldHaveVaultDaiDebt({
			current: '0.00',
			future: '8,000.12',
		});
	});
});

test.describe('Maker Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({
			metamask,
			app,
			network: 'mainnet',
			extraFeaturesFlags: 'MakerTenderly:true',
		}));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open a Maker Borrow ETH-A/DAI position @regression', async ({ metamask }) => {
		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/vaults/open/ETH-A');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '15.12345' });
		await app.position.setup.generate({ token: 'DAI', amount: '10000' });
		await app.position.setup.setupProxy1Of4();
		await app.position.setup.createProxy2Of4();
		await confirmAddToken({ metamask, app });

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '15.12345' });
		await app.position.setup.generate({ token: 'DAI', amount: '10000' });

		await app.position.setup.confirm();
		await app.position.setup.continueWithoutStopLoss();
		await app.position.setup.createVault3Of3();
		await confirmAddToken({ metamask, app });

		await app.position.setup.goToVault();
		await app.position.manage.shouldBeVisible('Manage your vault');
		// Verify that it has beenopened as 'Borrow' type
		await app.position.manage.shouldHaveButton({ label: 'ETH' });
	});
});
