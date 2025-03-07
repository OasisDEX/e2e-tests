import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Morpho Blue Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'USDT',
			balance: '100000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage a Morpho Blue Earn steakhouse-USDT position - steakhouse USDT @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/ethereum/erc-4626/earn/steakhouse-USDT#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'USDT', amount: '20000' },
			});
		});

		await test.step('Deposit (same token - USDT)', async () => {
			await app.page.waitForTimeout(4_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'USDT', amount: '10000' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '[2-3][0-9],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});

		await test.step('Withdraw', async () => {
			await app.page.waitForTimeout(4_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'USDT', amount: '20000' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '(1)?[0-9],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});

		await test.step('Deposit (different token - ETH)', async () => {
			await app.page.waitForTimeout(4_000);

			await app.position.setup.openTokenSelector();
			await app.position.setup.selectDepositToken('ETH');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '8' },
				allowanceNotNeeded: true,
				expectedAvailableToWithdraw: {
					amount: '[0-9]{2},[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
			});
		});
	});
});
