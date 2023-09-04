import { test, expect } from '#walletFixtures';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, testTimeout } from 'utils/config';
import { App } from 'src/app';

let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Earn - Wallet connected', async () => {
	test.beforeAll(async ({ context }) => {
		test.setTimeout(hooksTimeout);

		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup(app));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();
	});

	test('It should crete an Aave v3 Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11672',
		});

		test.setTimeout(testTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');
		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();
		await app.position.setup.openEarnPosition1Of2();

		// Position creation randomly fails - Retyr until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.goToPositionShouldBevisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage Earn position');
	});

	test('It should list an opened Earn position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11673',
		});

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);

		await app.header.shouldHavePortfolioCount('1');
		await app.portfolio.earn.shouldHaveHeaderCount('1');
		await app.portfolio.earn.vaults.first.shouldHave({ assets: 'WSTETH/ETH' });
	});

	test('It should open an Earn position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11681',
		});

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.earn.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage Earn position');
	});
});
