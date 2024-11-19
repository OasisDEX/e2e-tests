import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { confirmAddToken } from 'tests/sharedTestSteps/makerConfirmTx';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Earn - CLE - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Maker Earn CLE position - Stake', async () => {
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
				token: 'USDS',
				balance: '50000',
			});
		});

		await app.page.goto(`/earn/cle/${walletAddress}#overview`);

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.stake({ token: 'USDS', amount: '17500.50' });

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.setupAllowance();
		await confirmAddToken({ app });
		await app.position.setup.confirmStake();
		await confirmAddToken({ app });

		await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

		await app.position.overview.shouldHaveCollateralDeposited({
			stakingUsds: true,
			amount: '17,500.50',
			token: 'USDS',
		});
	});

	test('It should stake extra USDS on a CLE position', async () => {
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

		await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

		await app.position.overview.shouldHaveCollateralDeposited({
			stakingUsds: true,
			amount: '27,500.50',
			token: 'USDS',
		});
	});

	test('It should unstake USDS from an existing CLE position', async () => {
		test.setTimeout(longTestTimeout);

		await app.position.manage.unstake();

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.unstake({ token: 'USDS', amount: '15000' });

		// Delay to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.setup.confirmUnstake();
		await confirmAddToken({ app });

		await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

		await app.position.overview.shouldHaveCollateralDeposited({
			stakingUsds: true,
			amount: '12,500.50',
			token: 'USDS',
		});
	});
});
