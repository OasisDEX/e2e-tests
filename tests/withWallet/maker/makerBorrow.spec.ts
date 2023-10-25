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

test.describe('Maker Borrow - Wallet connected', async () => {
	test.beforeEach(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/vaults/open/ETH-A');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '15.12345' });
		await app.position.setup.generate({ token: 'DAI', amount: '10000' });
		await app.position.setup.setupProxy1Of4();
		await app.position.setup.createProxy2Of4();
		await metamask.confirmAddToken();

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
		await metamask.confirmAddToken();

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.vaults.first.shouldHave({ assets: 'ETH-A' });
	});

	// Skipping test as Maker position pages don't open when using forks
	test.skip('It should open a Maker Borrow position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11789',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.borrow.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
