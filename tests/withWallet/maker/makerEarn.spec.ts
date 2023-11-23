import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { baseUrl, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate a Maker Earn position before opening it - Deposit @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12543, 12557',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setDaiBalance({ forkId, daiBalance: '50000' });
			await tenderly.setSdaiBalance({ forkId, sDaiBalance: '100000' });
		});

		await app.page.goto(`/earn/dsr/${walletAddress}#overview`);
		await app.position.setup.deposit({ token: 'DAI', amount: '10000.12' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '10,000.12', token: 'DAI' });
		await app.position.overview.shouldHaveNext30daysNetValue({
			token: 'DAI',
			amount: '10,[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalDeposit({
			token: 'DAI',
			amount: '10,000.12',
		});
		await app.position.setup.orderInformation.shouldHaveEstimatedTransactionCost({
			fee: 'n/a',
		});
		await app.position.setup.setupProxyShouldBeVisible();

		await app.position.setup.dsr.mintSdai();
		await app.position.overview.shouldHaveTokenAmount({ amount: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveNext30daysNetValue({
			token: 'DAI',
			amount: '0.00',
		});
		await app.position.setup.orderInformation.shouldHaveTotalDeposit({
			token: 'DAI',
			amount: '10,000.12',
		});
		await app.position.setup.orderInformation.shouldHaveEstimatedTransactionCost({
			fee: 'n/a',
		});
		await app.position.setup.setAllowanceShouldBeVisible();
	});

	test('It should allow to simulate a Maker Earn position before opening it - Convert @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12556',
		});

		test.setTimeout(longTestTimeout);

		await app.position.setup.dsr.convert();
		await app.position.setup.dsr.convertSdaiToDai('7000.12');

		await app.position.overview.shouldHaveTokenAmount({ amount: '0.00', token: 'DAI' });
		await app.position.overview.shouldHaveNext30daysNetValue({
			token: 'DAI',
			amount: '0.00',
		});

		await app.position.setup.orderInformation.shouldHaveTotalSdaiToConvert('7,000.12');
		await app.position.setup.orderInformation.shouldHaveEstimatedTransactionCost({
			fee: '\\$[0-9]{1,2}.[0-9]{1,2}',
		});
	});

	test('It should open a Maker Earn position @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11800',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/earn/dsr/${walletAddress}#overview`);
		await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

		// If proxy was not previously setup extra steps will need to be executed
		const button = app.page
			.getByText('Set up DSR strategy')
			.locator('../../..')
			.locator('div:nth-child(3) > button');
		await expect(button).toBeVisible();
		const buttonLabel = await button.innerText();
		if (buttonLabel.includes('Setup Proxy')) {
			await app.position.setup.setupProxy();
			await app.position.setup.setupProxy(); // Thre are 2x Setup Proxy screens
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});

			// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
			await app.page.waitForTimeout(5_000);
			await app.page.reload();

			await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });
		}

		await app.position.setup.setupAllowance();
		await app.position.setup.unlimitedAllowance();
		await app.position.setup.setupAllowance();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		await app.position.setup.goToDeposit();
		await app.position.setup.confirmDeposit();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});

		/* 
			!!!
			TO BE UPDATED now that /owner page has been removed
			!!!
		*/
		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.topAssetsAndPositions.shouldHaveAsset({
		// 	asset: 'DAI',
		// 	amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})?',
		// });
	});

	test.skip('It should list an opened Maker Earn position in portfolio', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11802',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.earn.shouldHaveHeaderCount('1');
		// await app.portfolio.earn.vaults.first.shouldHave({ assets: 'DAI' });
	});

	// Skipping test as Maker position pages don't open when using forks and also because of BUG 10547
	test.skip('It should open a Maker Earn position from portfolio page', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11801',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.earn.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage ');
	});
});
