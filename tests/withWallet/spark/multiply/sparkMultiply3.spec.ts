import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
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

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Multiply Long position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
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
				token: 'DAI',
				balance: '50000',
			});
		});

		await app.page.goto('/ethereum/omni/spark/multiply/eth-dai');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			omni: { network: 'ethereum' },
		});
	});

	test('It should Deposit extra collateral on an existing Spark Multiply Long position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.overview.shouldHaveExposure({
			amount: '11.[0-9]{2}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 5,
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '5' },
			expectedCollateralExposure: {
				amount: '16.[0-9]{2}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw collateral from an existing Spark Multiply Long position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'ETH', amount: '7' },
			expectedCollateralExposure: {
				amount: '9.[0-9]{4}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow from an existing Spark Multiply Long position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.overview.shouldHaveDebt({
			amount: '[1-6],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
			timeout: expectDefaultTimeout * 5,
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.withdrawDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'DAI', amount: '15000' },
			expectedDebt: {
				amount: '[0-9]{2},[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			protocol: 'Spark',
		});
	});

	test('It should Pay back on an existing Spark Multiply Long position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'DAI', amount: '16000' },
			expectedDebt: {
				amount: '[1-5],[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			protocol: 'Spark',
		});
	});

	test('It should close an existent Spark Multiply Long position - Close to collateral token (ETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'DAI',
			tokenAmountAfterClosing: '[0-9].[0-9]{1,4}',
		});
	});
});
