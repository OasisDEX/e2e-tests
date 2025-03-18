import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

// SKIP - TO BE IMPROVED - Creating proxy needs to change gas setiings to marketor aggressive
test.describe.skip('Maker Earn - DSR - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'DAI',
			balance: '50000',
		});
		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'SDAI',
			balance: '100000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open a Maker Earn DSR position and simulate Deposit/Convert @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Open position', async () => {
			await app.page.goto(`/earn/dsr/${walletAddress}#overview`);
			await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

			await app.position.setup.setupProxy();
			await app.position.setup.setupProxy(); // Thre are 2x Setup Proxy screens
			await confirmAddToken({ metamask, app });

			// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
			await app.page.waitForTimeout(5_000);
			await app.page.reload();

			await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(1_000);

			await app.position.setup.setupAllowance();
			await app.position.setup.unlimitedAllowance();
			await app.position.setup.setupAllowance();
			// Confirm metamask popup twice
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();

			await app.position.setup.goToDeposit();
			await app.position.setup.confirmDeposit();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen();
			await app.position.setup.finished();
		});

		await test.step('Simulate - Deposit', async () => {
			await app.page.waitForTimeout(1_000);

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
				fee: '\\$[0-9]{1,2}.[0-9]{2}',
			});

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

		await test.step('Simulate - Convert', async () => {
			await app.page.waitForTimeout(1_000);

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
	});
});
