import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Earn - SRR - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should show show amount of SKY in wallet', async () => {
		test.setTimeout(longTestTimeout);

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
				token: 'SKY',
				balance: '50000',
			});
		});

		await app.page.goto(`/earn/srr/${walletAddress}#overview`);

		await app.position.overview.shouldHaveTotalSkyEarned('50,000.00');
		await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{3}.[0-9]{2}M');
	});

	test('It should open a Maker Earn SRR position - Stake', async () => {
		test.setTimeout(longTestTimeout);

		await test.step('Test setup', async () => {
			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'USDS',
				balance: '50000',
			});
		});

		await app.page.goto(`/earn/srr/${walletAddress}#overview`);

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.stake({ token: 'USDS', amount: '17500.50' });

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.setupAllowance();
		await confirmAddToken({ app });
		await app.position.setup.confirmStake();
		await confirmAddToken({ app });

		await app.position.setup.shouldShowSuccessScreen({ depositType: 'srr' });

		await app.position.overview.shouldHaveCollateralDeposited({
			srr: true,
			amount: '17,500.50',
			token: 'USDS',
		});
	});

	test('It should stake extra USDS on a SRR position', async () => {
		test.setTimeout(longTestTimeout);

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.stake({ token: 'USDS', amount: '10000' });

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.setupAllowance();
		await confirmAddToken({ app });
		await app.position.setup.confirmStake();
		await confirmAddToken({ app });

		await app.position.setup.shouldShowSuccessScreen({ depositType: 'srr' });

		await app.position.overview.shouldHaveCollateralDeposited({
			srr: true,
			amount: '27,500.50',
			token: 'USDS',
		});
	});
});
