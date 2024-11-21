import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'optimism' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Aave V3 Borrow Optimism ETH/USDC position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/optimism/aave/v3/borrow/eth-usdc');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '7.5' },
				borrow: { token: 'USDC', amount: '2000' },
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			await tenderly.setTokenBalance({
				forkId,
				network: 'optimism',
				walletAddress,
				token: 'DAI',
				balance: '200000',
			});

			await tenderly.changeAccountOwner({
				account: '0x1a7ab3359598aa32dbd04edbfa95600f43d89f14',
				newOwner: walletAddress,
				forkId,
			});

			await app.page.goto('/optimism/aave/v3/borrow/dai-wbtc/4#overview');

			// To avoid flakiness
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'DAI', amount: '100000' },
				borrow: { token: 'WBTC', amount: '0.3' },
				expectedCollateralDeposited: {
					amount: '100,[0-9]{3}.[0-9]{2}',
					token: 'DAI',
				},
				expectedDebt: { amount: '0.3[0-9]{2,3}', token: 'WBTC' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'DAI', amount: '20000' },
				payBack: { token: 'WBTC', amount: '0.1' },
				expectedCollateralDeposited: {
					amount: '80,[0-9]{3}.[0-9]{2}',
					token: 'DAI',
				},
				expectedDebt: { amount: '0.2[0-9]{2,3}', token: 'WBTC' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				allowanceNotNeeded: true,
				borrow: { token: 'WBTC', amount: '0.2' },
				deposit: { token: 'DAI', amount: '10000' },
				expectedCollateralDeposited: {
					amount: '90,[0-9]{3}.[0-9]{2}',
					token: 'DAI',
				},
				expectedDebt: { amount: '0.4[0-9]{2,3}', token: 'WBTC' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'WBTC', amount: '0.3' },
				withdraw: { token: 'DAI', amount: '10000' },
				expectedCollateralDeposited: {
					amount: '80,[0-9]{3}.[0-9]{2}',
					token: 'DAI',
				},
				expectedDebt: { amount: '0.1[0-9]{2,3}', token: 'WBTC' },
				protocol: 'Aave V3',
				allowanceNotNeeded: true,
			});
		});
	});
});
