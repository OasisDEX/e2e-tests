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

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Optimism position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12069',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'optimism' }));
		});

		await app.position.openPage('/optimism/aave/v3/borrow/eth-usdc');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '7.5' },
			borrow: { token: 'USDC', amount: '2000' },
		});
	});

	test('It should Deposit and Borrow in a single tx on an existing Aave V3 Borrow Optimism position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13664',
		});

		test.setTimeout(longTestTimeout);

		await tenderly.setTokenBalance({
			forkId,
			network: 'optimism',
			walletAddress,
			token: 'DAI',
			balance: '200000',
		});

		await tenderly.changeAccountOwner({
			account: '0x1a7ab3359598aa32dbd04edbfa95600f43d89f14',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/optimism/aave/v3/borrow/dai-wbtc/4#overview');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'DAI', amount: '100000' },
			borrow: { token: 'WBTC', amount: '0.3' },
			expectedCollateralDeposited: {
				amount: '100,[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			expectedDebt: { amount: '0.3[0-9]{2,3}', token: 'WBTC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Aave V3 Optimism Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'DAI', amount: '20000' },
			payBack: { token: 'WBTC', amount: '0.1' },
			expectedCollateralDeposited: {
				amount: '80,[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			expectedDebt: { amount: '0.2[0-9]{2,3}', token: 'WBTC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Aave V3 Optimism Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'WBTC', amount: '0.2' },
			deposit: { token: 'DAI', amount: '10000' },
			expectedCollateralDeposited: {
				amount: '90,[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			expectedDebt: { amount: '0.4[0-9]{2,3}', token: 'WBTC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Aave V3 Optimism Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'WBTC', amount: '0.3' },
			withdraw: { token: 'DAI', amount: '10000' },
			expectedCollateralDeposited: {
				amount: '80,[0-9]{3}.[0-9]{2}',
				token: 'DAI',
			},
			expectedDebt: { amount: '0.1[0-9]{2,3}', token: 'WBTC' },
			protocol: 'Aave V3',
			allowanceNotNeeded: true,
		});
	});

	test('It should close an existent Aave V3 Borrow Optimism position - Close to debt token (WBTC)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12914',
		});

		test.setTimeout(longTestTimeout);

		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			forkId,
			app,
			positionType: 'Borrow',
			closeTo: 'debt',
			collateralToken: 'DAI',
			debtToken: 'WBTC',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{3,4}',
		});
	});
});
