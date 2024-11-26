import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout, positionTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';
import { reloadUntilCorrect } from 'utils/general';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '50',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Earn Ethereum position - WSTETH-ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wsteth-eth#simulate');

		await test.step('It should Open a position', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '1' },
			});
		});

		await test.step('It should Deposti extra collateral', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.overview.shouldHaveExposure({
				amount: '0.9[0-9]{3}',
				token: 'WSTETH',
				timeout: positionTimeout,
			});
			await app.position.overview.shouldHaveDebt({
				amount: '0.1[0-9]{3}',
				token: 'ETH',
			});

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '2' },
				expectedCollateralExposure: {
					amount: '2.9[0-9]{3}',
					token: 'WSTETH',
				},
				expectedDebt: {
					amount: '0.1[0-9]{3}',
					token: 'ETH',
				},
				protocol: 'Aave V3',
			});
		});

		await test.step('It should Withdraw collateral', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);
			await reloadUntilCorrect(app);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');
			await app.position.manage.withdrawCollateral();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'WSTETH', amount: '1' },
				expectedCollateralExposure: {
					amount: '1.9[0-9]{3}',
					token: 'WSTETH',
				},
				expectedDebt: {
					amount: '0.1[0-9]{3}',
					token: 'ETH',
				},
				protocol: 'Aave V3',
			});
		});

		await test.step('It should Borrow', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);
			await reloadUntilCorrect(app);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.withdrawDebt();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				borrow: { token: 'ETH', amount: '1' },
				expectedCollateralExposure: {
					amount: '1.9[0-9]{3}',
					token: 'WSTETH',
				},
				expectedDebt: {
					amount: '1.1[0-9]{3}',
					token: 'ETH',
				},
				protocol: 'Aave V3',
			});
		});

		await test.step('It should Pay back', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);
			await reloadUntilCorrect(app);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'ETH', amount: '1' },
				expectedCollateralExposure: {
					amount: '1.9[0-9]{3}',
					token: 'WSTETH',
				},
				expectedDebt: {
					amount: '0.1[0-9]{3}',
					token: 'ETH',
				},
				protocol: 'Aave V3',
			});
		});
	});
});
