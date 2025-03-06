import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;
let positionId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

// No liquidity for SDAI/USDT - To be updated with another pool
test.describe.skip('Spark Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(veryLongTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'SDAI',
			balance: '30000',
		});

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'USDT',
			balance: '30000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open a Spark Earn position - SDAI/USDT @regression', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/earn/SDAI-USDT#setup');

		await test.step('Open position', async () => {
			await app.page.waitForTimeout(1_000);

			positionId =
				(await openPosition({
					metamask,
					app,
					vtId,
					deposit: { token: 'SDAI', amount: '10000' },
				})) ?? 'error';
		});

		await test.step('Deposit extra collateral', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.overview.shouldHaveExposure({
				amount: '1[0-2],[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			});
			await app.position.overview.shouldHaveDebt({
				amount: '(1,)?[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			});

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'SDAI', amount: '5000' },
				allowanceNotNeeded: true,
				expectedCollateralExposure: {
					amount: '1[5-7],[0-9]{3}.[0-9]{2}',
					token: 'SDAI',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Withdraw', async () => {
			await app.page.waitForTimeout(1_000);

			// Reload page to avoid random fails
			await app.position.openPage(positionId);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');
			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'SDAI', amount: '3000' },
				expectedCollateralExposure: {
					amount: '1[2-4],[0-9]{3}.[0-9]{2}',
					token: 'SDAI',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Borrow', async () => {
			await app.page.waitForTimeout(1_000);

			// Pause and Reload page to avoid random fails
			await app.position.openPage(positionId);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.withdrawDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				borrow: { token: 'USDT', amount: '7000' },
				expectedDebt: {
					amount: '[7-8],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Pay back', async () => {
			await app.page.waitForTimeout(1_000);

			// Reload page to avoid random fails
			await app.position.openPage(positionId);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				payBack: { token: 'USDT', amount: '3000' },
				expectedDebt: {
					amount: '[4-5],[0-9]{3}.[0-9]{2}',
					token: 'USDT',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Close position', async () => {
			await app.page.waitForTimeout(1_000);

			// Pause and reload to avoid random fails
			await app.position.openPage(positionId);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Earn (Yield Loop)',
				closeTo: 'debt',
				collateralToken: 'SDAI',
				debtToken: 'USDT',
				tokenAmountAfterClosing: '[7-9],[0-9]{3}.[0-9]{1,2}',
			});
		});
	});
});
