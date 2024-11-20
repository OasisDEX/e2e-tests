import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Morpho Blue Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'USDT',
			balance: '100000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage a Morpho Blue Earn steakhouse-USDT position - steakhouse USDT @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/erc-4626/earn/steakhouse-USDT#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'USDT', amount: '20000' },
			});
		});

		await test.step('Deposit (same token - USDT)', async () => {
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'USDT', amount: '10000' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '[2-3][0-9],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});

		await test.step('Withdraw', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'USDT', amount: '20000' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '(1)?[0-9],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});

		await test.step('Deposit (different token - ETH)', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.setup.openTokenSelector();
			await app.position.setup.selectDepositToken('ETH');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '80' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '[0-9]{3},[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});
	});
});