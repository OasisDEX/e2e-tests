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

test.describe('Maker Earn - CLE - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'USDS',
			balance: '50000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
		await app.page.close();
	});

	test('It should open and manage a Maker Earn CLE position - Stake', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto(`/earn/cle/${walletAddress}#overview`);

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.setup.stake({ token: 'USDS', amount: '17500.50' });

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

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '17,500.50',
				token: 'USDS',
			});
		});

		await test.step('It should stake extra USDS', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.setup.stake({ token: 'USDS', amount: '10000' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.setupAllowance();
			// Confirm metamask popup twice
			await metamask.addNewToken();
			await metamask.addNewToken();

			await app.position.setup.confirmStake();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '27,500.50',
				token: 'USDS',
			});
		});

		await test.step('It should stake extra USDS', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.manage.unstake();

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.unstake({ token: 'USDS', amount: '15000' });

			// Delay to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.confirmUnstake();
			await confirmAddToken({ metamask, app });

			await app.position.setup.shouldShowSuccessScreen({ depositType: 'cle' });

			await app.position.overview.shouldHaveCollateralDeposited({
				stakingUsds: true,
				amount: '12,500.50',
				token: 'USDS',
			});
		});
	});
});
