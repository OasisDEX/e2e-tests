import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { baseUrl, extremelyLongTestTimeout } from 'utils/config';
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

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/vaults/open/ETH-C');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.12345' });
		await app.position.overview.shouldHaveCollateralLockedAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '[0-9]{1,2}.[0-9]{5}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToGenerate({
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
		await app.position.setup.vaultChanges.shouldHaveMaxGasFee('\\$[0-9]{1,2}.[0-9]{1,2}');

		await app.position.setup.generate({ token: 'DAI', amount: '8,000.12' });
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-2],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveCollateralizationRatio('[0-9]{3}.[0-9]{2}%');
		await app.position.overview.shouldHaveVaultDaiDebt('8,000.1200');
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

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		await app.page.goto('/vaults/open/ETH-A');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
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
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '15.12345' });
		await app.position.setup.generate({ token: 'DAI', amount: '10000' });

		await app.position.setup.confirm();
		await app.position.setup.addStopLoss2Of3();
		await app.position.setup.createVault3Of3();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);

		/* 
			!!!
			TO BE UPDATED now that /owner page has been removed
			!!!
		*/
		// await expect(async () => {
		// 	await app.page.goto(`/owner/${walletAddress}`);
		// 	await app.portfolio.topAssetsAndPositions.shouldHaveAsset({
		// 		asset: 'ETH-A Summer.fi Borrow',
		// 		amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
		// 	});
		// }).toPass();
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
