import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11811',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/spark/borrow/eth-dai#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '7.5' },
			borrow: { token: 'DAI', amount: '5000' },
		});
	});

	test('It should Deposit and Borrow in a single tx from an existing Spark Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13659',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			deposit: { token: 'ETH', amount: '1.5' },
			borrow: { token: 'DAI', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'ETH',
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

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'ETH', amount: '1.5' },
			payBack: { token: 'DAI', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '7.50',
				token: 'ETH',
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

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'DAI', amount: '1000' },
			deposit: { token: 'ETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '9.00',
				token: 'ETH',
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

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'DAI', amount: '1000' },
			withdraw: { token: 'ETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '7.50',
				token: 'ETH',
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

		test.setTimeout(longTestTimeout);

		// Pause and relaod to avoid random fails
		await app.page.waitForTimeout(1000);
		await app.page.reload();

		await close({
			forkId,
			app,
			positionType: 'Borrow',
			closeTo: 'debt',
			collateralToken: 'ETH',
			debtToken: 'DAI',
			tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
	});

	test.skip('It should list an opened Spark Borrow position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11813',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.header.shouldHavePortfolioCount('1');
		// await app.portfolio.borrow.shouldHaveHeaderCount('1');
		// await app.portfolio.borrow.vaults.first.shouldHave({ assets: 'ETH/DAI' });
	});

	test.skip('It should open an Spark Borrow position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11812',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.borrow.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage collateral');
	});
});
