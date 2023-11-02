import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Multiply position @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11797, 11798',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/vaults/open-multiply/ETH-B');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });

		// If proxy was not previous setup extra steps will need to be executed
		const button = app.page
			.getByText('Configure your Vault')
			.locator('../../..')
			.locator('div:nth-child(3) > button')
			.nth(1);
		await expect(button).toBeVisible();
		const buttonLabel = await button.innerText();
		if (buttonLabel.includes('Setup Proxy')) {
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
			await app.position.setup.deposit({ token: 'ETH', amount: '10.543' });
		}

		await app.position.setup.confirm();
		await app.position.setup.addStopLoss2Of3();
		await app.position.setup.createVault3Of3();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		/**
		 * !!! Skiping final steps because of BUG 10547
		 * // Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		 * await app.page.waitForTimeout(5_000);
		 * await app.page.reload();
		 *
		 * await app.page.goto(`/owner/${walletAddress}`);
		 * await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'ETH-B' });
		 */
	});

	test('It should allow to simulate a Maker Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12573',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/vaults/open-multiply/WSTETH-A');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '20.12345' });
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2,3},[0-9]{3}.[0-9]{2}',
			protocol: 'Maker',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveVaultDaiDebt('[0-9]{1,2},[0-9]{3}.[0-9]{4}');
		await app.position.overview.shouldHaveTotalCollateral({
			token: 'WSTETH',
			amount: '[0-9]{2}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '\\$[0-9]{3}(.[0-9]{1,2})?',
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
			percentage: '0.[0-9]{2}',
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

	// Skipping test as Maker position pages don't open when using forks  and also because of BUG 10547
	test.skip('It should open a Maker Multiply position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11799',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.multiply.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
