import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Earn - DSR - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Earn DSR position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11800',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'DAI',
				balance: '50000',
			});
			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'SDAI',
				balance: '100000',
			});
		});

		await app.page.goto(`/earn/dsr/${walletAddress}#overview`);
		await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

		await app.position.setup.setupProxy();
		await app.position.setup.setupProxy(); // Thre are 2x Setup Proxy screens
		await confirmAddToken({ app });

		// Wait for 5 seconds and reload page | Issue with Maker and staging/forks
		await app.page.waitForTimeout(5_000);
		await app.page.reload();

		await app.position.setup.deposit({ token: 'DAI', amount: '17500.50' });

		await app.position.setup.setupAllowance();
		await app.position.setup.unlimitedAllowance();
		await app.position.setup.setupAllowance();
		await confirmAddToken({ app });

		await app.position.setup.goToDeposit();
		await app.position.setup.confirmDeposit();
		await confirmAddToken({ app });

		await app.position.setup.shouldShowSuccessScreen();
	});

	test('It should allow to simulate a Maker Earn DSR position before opening it - Deposit', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12543, 12557',
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

	test('It should allow to simulate a Maker Earn DSR position before opening it - Convert', async () => {
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
});
