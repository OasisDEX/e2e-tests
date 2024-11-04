import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
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

test.describe('Spark Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Borrow position - RETH/DAI @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11811',
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
				token: 'RETH',
				balance: '20',
			});
		});

		await app.page.goto('/ethereum/spark/borrow/reth-dai#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'RETH', amount: '7.5' },
			borrow: { token: 'DAI', amount: '5000' },
		});
	});

	test('It should Deposit and Borrow in a single tx from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(veryLongTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			deposit: { token: 'RETH', amount: '1.5' },
			borrow: { token: 'DAI', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'RETH',
			},
			expectedDebt: { amount: '6,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Spark',
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13660',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'RETH', amount: '1.5' },
			payBack: { token: 'DAI', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '7.50',
				token: 'RETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Spark',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13661',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'DAI', amount: '1000' },
			deposit: { token: 'RETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'RETH',
			},
			expectedDebt: { amount: '6,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Spark',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13662',
		});

		test.setTimeout(veryLongTestTimeout);

		// Wait to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'DAI', amount: '1000' },
			withdraw: { token: 'RETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '7.50',
				token: 'RETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Spark',
			allowanceNotNeeded: true,
		});
	});

	test('It should close an existent Aave V3 Borrow Ethereum position - Close to debt token (DAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12060',
		});

		test.setTimeout(veryLongTestTimeout);

		// Pause and relaod to avoid random fails
		await app.page.waitForTimeout(2_000);

		await close({
			forkId,
			app,
			positionType: 'Borrow',
			openManagementOptionsDropdown: { currentLabel: 'DAI' },
			closeTo: 'debt',
			collateralToken: 'RETH',
			debtToken: 'DAI',
			tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
	});
});
