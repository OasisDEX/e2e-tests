import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;
let positionId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12089',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'SDAI',
				balance: '30000',
			});

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'USDT',
				balance: '30000',
			});
		});

		await app.page.goto('/ethereum/spark/earn/SDAI-USDT#setup');

		positionId = await openPosition({
			app,
			forkId,
			deposit: { token: 'SDAI', amount: '10000' },
		});
	});

	test('It should Deposit extra collateral on an existing Spark Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

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
			app,
			forkId,
			deposit: { token: 'SDAI', amount: '5000' },
			allowanceNotNeeded: true,
			expectedCollateralExposure: {
				amount: '1[5-7],[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			protocol: 'Spark',
		});
	});

	test('It should Withdraw from an existing Spark Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.position.openPage(positionId);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'SDAI', amount: '3000' },
			expectedCollateralExposure: {
				amount: '1[2-4],[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			protocol: 'Spark',
		});
	});

	test('It should Borrow from an existing Spark Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.position.openPage(positionId);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.withdrawDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'USDT', amount: '7000' },
			expectedDebt: {
				amount: '[7-8],[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			},
			protocol: 'Spark',
		});
	});

	test('It should Pay back on an existing Spark Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.position.openPage(positionId);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'USDT', amount: '3000' },
			expectedDebt: {
				amount: '[4-5],[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			},
			protocol: 'Spark',
		});
	});

	test('It should close an existent Spark Earn position - Close to debt token (USDT)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12894',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.position.openPage(positionId);

		await close({
			app,
			forkId,
			positionType: 'Earn (Yield Loop)',
			closeTo: 'debt',
			collateralToken: 'SDAI',
			debtToken: 'USDT',
			tokenAmountAfterClosing: '[7-9],[0-9]{3}.[0-9]{1,2}',
		});
	});
});
