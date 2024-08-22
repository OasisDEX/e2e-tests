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
} from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

// Position incorrectly updated to Borrow when  taking ownership of it.
//   - Comment  from dev: "I think it is related to the functionality in borrow
//   that marks the position as multiply/borrow nothing we can do on chain i'm afraid"
test.describe.skip('Spark Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should switch a Spark Multiply Short position to Borrow interface', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
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

		await tenderly.changeAccountOwner({
			account: '0xb585a1bae38dc735988cc75278aecae786e6a5d6',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/spark/multiply/sdai-eth/1448#overview');

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Switch to Borrow');
		await app.position.manage.confirm();
		await app.position.manage.confirm();

		await app.position.overview.shouldHaveCollateralDeposited({
			amount: '[0-9]{1,2}.[0-9]{1,2}',
			token: 'SDAI',
			timeout: expectDefaultTimeout * 5,
		});
	});

	test('It should switch a Spark Multiply Short position (from Borrow) back to Multiply interface', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'SDAI' });
		await app.position.manage.select('Switch to Multiply');
		await app.position.manage.confirm();
		await app.position.manage.confirm();

		await app.position.overview.shouldHaveMultiple('[0-9](.[0-9]{1,2})?');
	});

	test('It should Deposit extra collateral on an existing Spark Multiply Short position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

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

	test('It should Borrow from an existing Spark Multiply Short position', async () => {
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

	test('It should adjust risk of an existent Spark Multiply Short position - Up', async () => {
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

	test('It should adjust risk of an existent Spark Multiply Short position - Down', async () => {
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

	test('It should close an existent Spark Multiply Short position - Close to debt token (ETH)', async () => {
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
