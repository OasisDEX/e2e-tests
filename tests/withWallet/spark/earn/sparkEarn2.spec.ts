import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, manageDebtOrCollateral } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Deposit extra collateral on an existing Spark Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
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
				token: 'WSTETH',
				balance: '100',
			});
		});

		await tenderly.changeAccountOwner({
			account: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/spark/earn/wsteth-eth/1417#overview');

		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '20' },
			expectedCollateralExposure: {
				amount: '20.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '0.[0-9]{4}',
				token: 'ETH',
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
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'WSTETH', amount: '10' },
			expectedCollateralExposure: {
				amount: '10.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '0.[0-9]{4}',
				token: 'ETH',
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
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.withdrawDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'ETH', amount: '7' },
			expectedCollateralExposure: {
				amount: '10.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '7.[0-9]{2}',
				token: 'ETH',
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
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'ETH', amount: '5' },
			expectedCollateralExposure: {
				amount: '10.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '2.[0-9]{2}',
				token: 'ETH',
			},
			protocol: 'Spark',
		});
	});

	test('It should close an existent Spark Earn position - Close to debt token (ETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12894',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Earn',
			closeTo: 'debt',
			collateralToken: 'WSTETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9].[0-9]{1,2}([0-9]{1,2})?',
		});
	});
});
