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

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Deposit on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13664',
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
				balance: '100',
			});
		});

		await tenderly.changeAccountOwner({
			account: '0x6bb713b56e73a115164b4b56ea1f5a76640c4d19',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/multiply/reth-dai/1276#overview');

		await app.position.shouldHaveTab('Protection ON');

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'RETH', amount: '50' },
			expectedCollateralExposure: {
				amount: '50.[0-9]{1,2}',
				token: 'RETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13665',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'RETH', amount: '8' },
			expectedCollateralExposure: {
				amount: '4[1-2].[0-9]{1,2}',
				token: 'RETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13664',
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
			borrow: { token: 'DAI', amount: '40000' },
			expectedDebt: { amount: '40,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Aave V3',
		});
	});

	test('It should Pay back on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13666',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.reduceDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'DAI', amount: '32000' },
			expectedDebt: { amount: '8,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
			protocol: 'Aave V3',
		});
	});

	test('It should close an existent Aave V3 Multiply Ethereum position - Close to collateral token (RETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12057',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'collateral',
			collateralToken: 'RETH',
			debtToken: 'DAI',
			tokenAmountAfterClosing: '[0-9]{2}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});
});
