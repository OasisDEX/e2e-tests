import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe.skip('Maker Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate a Maker Borrow position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12572',
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

	test('It should open a Maker Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/vaults/open/ETH-A');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });
		await app.position.setup.deposit({ token: 'ETH', amount: '15.12345' });
		await app.position.setup.generate({ token: 'DAI', amount: '10000' });
		await app.position.setup.setupProxy1Of4();
		await app.position.setup.createProxy2Of4();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

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
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		await app.position.setup.goToVault();
		await app.position.manage.shouldBeVisible('Manage your vault');
		// Verify that it has beenopened as 'Borrow' type
		await app.position.manage.shouldHaveButton({ label: 'ETH' });
	});

	// Skipping test as Maker position pages don't open when using forks
	test.skip('It should open a Maker Borrow position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11789',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
