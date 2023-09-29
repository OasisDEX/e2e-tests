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

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Multiply - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'mainnet' }));
		await tenderly.setWstethBalance({ forkId, rEthBalance: '1000' });
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12104',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/RETH-ETH');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'RETH', amount: '7.543' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await metamask.confirmAddToken();
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();

		// await app.position.setup.setupAllowance();
		await app.position.setup.approveAllowance();
		await metamask.confirmAddToken();
		await app.position.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.shouldConfirmPositionCreation();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});
});