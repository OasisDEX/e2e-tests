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

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Ethereum position - WSTETH/USDT @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11682',
		});

		test.setTimeout(extremelyLongTestTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '50',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/WSTETH-USDT#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '7.5' },
			borrow: { token: 'USDT', amount: '3000' },
		});
	});

	test('It should Deposit and Borrow in a single tx from an existing Aave V3 Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			deposit: { token: 'WSTETH', amount: '1.5' },
			borrow: { token: 'USDT', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '4,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Aave V3 Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'WSTETH', amount: '2' },
			payBack: { token: 'USDT', amount: '2000' },
			expectedCollateralDeposited: {
				amount: '7.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '2,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Aave V3 Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'USDT', amount: '3000' },
			deposit: { token: 'WSTETH', amount: '3' },
			expectedCollateralDeposited: {
				amount: '10.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
			protocol: 'Aave V3',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Aave V3 Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'USDT', amount: '4000' },
			withdraw: { token: 'WSTETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '8.50',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '1,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
			protocol: 'Aave V3',
			allowanceNotNeeded: true,
		});
	});

	test('It should close an existent Aave V3 Borrow Ethereum position - Close to collateral token (WSTETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12060',
		});

		test.setTimeout(longTestTimeout);

		// Pause and relaod to avoid random fails
		await app.page.waitForTimeout(1000);
		await app.page.reload();

		await close({
			forkId,
			app,
			positionType: 'Borrow',
			closeTo: 'collateral',
			collateralToken: 'WSTETH',
			debtToken: 'USDT',
			tokenAmountAfterClosing: '[4-8].[0-9]{3,4}',
		});
	});
});
