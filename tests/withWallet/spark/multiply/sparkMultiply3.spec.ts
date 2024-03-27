import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { expectDefaultTimeout, extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	adjustRisk,
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
				token: 'SDAI',
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

	// TO BE UPDATED
	test.skip('It should Deposit extra collateral on an existing Spark Multiply Long position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();
		//
		await app.pause();
		//
		await app.position.overview.shouldHaveExposure({
			amount: '22,[0-9]{3}.[0-9]{2}',
			token: 'SDAI',
			timeout: expectDefaultTimeout * 5,
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'SDAI', amount: '30000' },
			expectedCollateralExposure: {
				amount: '30,[0-9]{3}.[0-9]{2}',
				token: 'SDAI',
			},
			protocol: 'Aave V3',
		});
	});

	// TO BE UPDATED
	test.skip('It should Borrow from an existing Spark Multiply position', async () => {
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
		await app.position.manage.withdrawDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'ETH', amount: '1' },
			expectedDebt: {
				amount: '1.[0-9]{3,4}',
				token: 'ETH',
			},
			protocol: 'Spark',
		});
	});

	// TO BE UPDATED
	test.skip('It should adjust risk of an existent Spark Multiply position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12896',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			shortPosition: true,
			risk: 'up',
			newSliderPosition: 0.6,
		});
	});

	// TO BE UPDATED
	test.skip('It should adjust risk of an existent Spark Multiply position - Down', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12898',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			shortPosition: true,
			risk: 'down',
			newSliderPosition: 0.2,
		});
	});

	// TO BE UPDATED
	test.skip('It should close an existent Spark Earn position - Close to debt token (ETH', async () => {
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
			tokenAmountAfterClosing: '[0-9].[0-9]{1,4}',
		});
	});
});
