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

	test('It should open a Spark Multiply Short position - SDAI/ETH @regression', async () => {
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
				token: 'SDAI',
				balance: '50000',
			});
		});

		await app.page.goto('/ethereum/spark/multiply/sdai-eth');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'SDAI', amount: '20000' },
		});
	});

	test('It should Withdraw collateral from an existing Spark Multiply Short position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();
		await app.position.overview.shouldHaveExposure({
			amount: '22,[0-9]{3}.[0-9]{2}',
			token: 'SDAI',
			timeout: expectDefaultTimeout * 5,
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'SDAI', amount: '5000' },
			expectedCollateralExposure: {
				amount: '17,[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			protocol: 'Spark',
		});
	});

	test('It should Pay back on an existing Spark Multiply Short position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();
		await app.position.overview.shouldHaveDebt({
			amount: '[0-1].[0-9]{4}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 5,
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.reduceDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'ETH', amount: '0.4' },
			expectedDebt: {
				amount: '0.[0-6][0-9]{3}',
				token: 'ETH',
			},
			protocol: 'Spark',
		});
	});

	// Failing to estimate fee with current code. Try to add pauses.
	test.skip('It should close an existent Spark Multiply Short position - Close to collateral token (SDAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12897',
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
			collateralToken: 'SDAI',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '1[5-7],[0-9]{3}.[0-9]{2}',
		});
	});
});
