import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, testTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp());
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup(app));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Multiply position', async () => {
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

		test.setTimeout(testTimeout);

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
			await metamask.confirmAddToken();

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
		await metamask.confirmAddToken();

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

		test.setTimeout(testTimeout);

		await app.page.goto(`/owner/${walletAddress}`);
		await app.portfolio.multiply.vaults.first.view();
		await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
