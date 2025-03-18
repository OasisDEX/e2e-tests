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

test.describe('Sky Earn - SRR - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'SKY',
			balance: '50000',
		});
		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'USDS',
			balance: '500000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage Sky Earn SRR position', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/earn/srr/${walletAddress}#overview`);

		await test.step('Show amount of SKY in wallet', async () => {
			await app.position.overview.shouldHaveTotalSkyEarned('50,000.00');
			await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{3}.[0-9]{2}M');
		});

		await test.step('Open a Sky Earn SRR position - Stake', async () => {
			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.stake({ token: 'USDS', amount: '400000.50' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.setupAllowance();
			// Confirm metamask popup twice
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();

			await app.position.setup.confirmStake();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'srr' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '400,000.50',
				token: 'USDS',
			});
		});

		await test.step('Stake extra USDS', async () => {
			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.stake({ token: 'USDS', amount: '10000' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.setupAllowance();
			// Confirm metamask popup twice
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();
			await app.page.waitForTimeout(1_000);
			await metamask.addNewToken();

			await app.position.setup.confirmStake();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'srr' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '410,000.50',
				token: 'USDS',
			});
		});

		await test.step('Unstake USDS', async () => {
			await app.position.manage.unstake();

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.unstake({ token: 'USDS', amount: '20000' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.confirmUnstake();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'srr' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '390,000.50',
				token: 'USDS',
			});
		});

		await test.step('Claim SKY earned', async () => {
			await app.position.overview.shouldHaveSkyEarned({ greaterThanZero: true });

			await app.position.manage.claim();
			await app.position.manage.shouldReceiveSky('0.[0-9]{4}');

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.confirmClaim();
			await confirmAddToken({ metamask, app });

			await app.position.overview.shouldHaveSkyEarned({ amount: '0.00' });
		});
	});
});
