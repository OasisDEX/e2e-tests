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

	test('It should open an Aave V3 Borrow Ethereum position @regression', async () => {
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
			token: 'CBETH',
			balance: '50',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/cbeth-eth#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '7.5' },
			borrow: { token: 'ETH', amount: '3' },
			omni: { network: 'ethereum' },
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
			deposit: { token: 'CBETH', amount: '1.5' },
			borrow: { token: 'ETH', amount: '2' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '5.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
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
			withdraw: { token: 'CBETH', amount: '2' },
			payBack: { token: 'ETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '7.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '4.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Aave V3 Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'ETH', amount: '2' },
			deposit: { token: 'CBETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '8.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '6.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
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

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'ETH', amount: '3' },
			withdraw: { token: 'CBETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '6.50',
				token: 'CBETH',
			},
			expectedDebt: { amount: '3.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			protocol: 'Aave V3',
			allowanceNotNeeded: true,
		});
	});

	test('It should close an existent Aave V3 Borrow Ethereum position - Close to collateral token (CBETH)', async () => {
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
			collateralToken: 'CBETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[3-8].[0-9]{3,4}',
		});
	});

	test.skip('It should list an opened Aave V3 Borrow Ethereum position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11673',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/USDC' });
	});

	test.skip('It should open an Aave V3 Borrow Ethereum position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11681',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
