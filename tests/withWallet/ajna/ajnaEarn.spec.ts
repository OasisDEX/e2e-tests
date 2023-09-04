import { test, expect } from '#walletFixtures';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as wallet from '#walletUtils';
import * as termsAndconditions from '#termsAndConditions';
import * as tenderly from 'utils/tenderly';
import * as localStorage from 'utils/localStorage';
import * as fork from 'utils/fork';
import { App } from 'src/app';

let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Earn - Wallet connected', async () => {
	test.beforeAll(async ({ context }) => {
		let page = await context.newPage();
		app = new App(page);

		await app.page.goto('');

		await wallet.connect(app);
		await termsAndconditions.accept(app);

		await localStorage.enableNetworkSwitcherFoks(app);

		const resp = await tenderly.createFork();
		forkId = resp.data.root_transaction.fork_id;

		await fork.addToApp({ app, forkId });

		await tenderly.setEthBalance({ forkId, ethBalance: '15000' });
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();
	});

	test('It should crete an Ajna Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11657',
		});

		await app.page.goto('/ethereum/ajna/earn/CBETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();
		// Confirmation button with same label
		await app.position.setup.createSmartDeFiAccount();
		await metamask.confirmAddToken();
		await app.position.setup.continue();

		// Position creation randomly fails - Retyr until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await metamask.confirmPermissionToSpend();
			await app.position.setup.shouldConfirmPositionCreation();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage your ');
	});
});
