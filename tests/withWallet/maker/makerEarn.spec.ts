import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Earn - Wallet connected', async () => {
	// 'beforeEach` should be changed to 'beforeAll' if skipped tests are enabled
	test.beforeEach(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

		await tenderly.setDaiBalance({ forkId, daiBalance: '50000' });
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Earn position @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11800, 11802',
			},
			{
				type: 'Bug',
				description: '10547',
			}
		);

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/earn/dsr/${walletAddress}#overview`);

		await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

		// If proxy was not previous setup extra steps will need to be executed
		const button = app.page
			.getByText('Set up DSR strategy')
			.locator('../../..')
			.locator('div:nth-child(3) > button');
		await expect(button).toBeVisible();
		const buttonLabel = await button.innerText();
		if (buttonLabel.includes('Setup Proxy')) {
			await app.position.setup.setupProxy();
			await app.position.setup.setupProxy(); // Thre are 2x Setup Proxy screens
			await metamask.confirmAddToken();

			// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
			await app.page.waitForTimeout(5_000);
			await app.page.reload();

			await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });
		}

		await app.position.setup.setupAllowance();
		await app.position.setup.unlimitedAllowance();
		await app.position.setup.setupAllowance();
		await metamask.confirmAddToken();

		await app.position.setup.goToDeposit();
		await app.position.setup.confirmDeposit();
		await metamask.confirmAddToken();

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.topAssetsAndPositions.shouldHaveAsset({
			asset: 'DAI',
			percentage: '0',
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})?',
		});
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

		await app.page.goto(`/owner/${walletAddress}`);

		await app.portfolio.earn.shouldHaveHeaderCount('1');
		await app.portfolio.earn.vaults.first.shouldHave({ assets: 'DAI' });
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

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.earn.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage ');
	});
});
