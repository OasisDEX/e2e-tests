import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Spark Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'mainnet',
			token: 'SDAI',
			balance: '50000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage a Spark Multiply SDAI/ETH Short position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/multiply/sdai-eth');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'SDAI', amount: '20000' },
			});
		});

		await test.step('Deposit extra collateral', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.overview.shouldHaveExposure({
				amount: '2[1-3],[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			});

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'SDAI', amount: '10000' },
				allowanceNotNeeded: true,
				expectedCollateralExposure: {
					amount: '3[2-4],[0-9]{3}.[0-9]{2}',
					token: 'SDAI',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Withdraw collateral', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'SDAI', amount: '5000' },
				expectedCollateralExposure: {
					amount: '2[7-9],[0-9]{3}.[0-9]{2}',
					token: 'SDAI',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Borrow more', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.overview.shouldHaveDebt({
				amount: '[0-1].[0-9]{4}',
				token: 'ETH',
				timeout: expectDefaultTimeout * 5,
			});

			await app.position.manage.openManageOptions({ currentLabel: 'SDAI' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.withdrawDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				borrow: { token: 'ETH', amount: '2' },
				expectedDebt: {
					amount: '[2-3].[0-9]{4}',
					token: 'ETH',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Pay back', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.reduceDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'ETH', amount: '1' },
				expectedDebt: {
					amount: '[1-2].[0-9]{4}',
					token: 'ETH',
				},
				protocol: 'Spark',
			});
		});

		await test.step('Close position', async () => {
			await app.page.waitForTimeout(1_000);

			await app.page.reload();

			// Randomly failing to estimate fee
			await close({
				metamask,
				app,
				forkId,
				positionType: 'Multiply',
				closeTo: 'collateral',
				collateralToken: 'SDAI',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '2[1-3],[0-9]{3}.[0-9]{2}',
			});
		});
	});
});
