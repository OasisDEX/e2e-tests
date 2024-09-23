import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, positionTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';
import { reloadUntilCorrect } from 'utils/general';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn Ethereum position - WSTETH-ETH @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11672',
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
				token: 'WSTETH',
				balance: '50',
			});
		});

		await app.position.openPage('/ethereum/aave/v3/earn/wsteth-eth#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
		});
	});

	test('It should Deposit extra collateral on an existing Aave V3 Ethereum Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.overview.shouldHaveExposure({
			amount: '9.[0-9]{4}',
			token: 'WSTETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({
			amount: '1.[0-9]{4}',
			token: 'ETH',
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '20' },
			expectedCollateralExposure: {
				amount: '29.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '1.[0-9]{4}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw from an existing Aave V3 Ethereum Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(1_000);
		await reloadUntilCorrect(app);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'WSTETH', amount: '10' },
			expectedCollateralExposure: {
				amount: '19.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '1.[0-9]{2}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow from an existing Aave V3 Ethereum Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(1_000);
		await reloadUntilCorrect(app);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.withdrawDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'ETH', amount: '10' },
			expectedCollateralExposure: {
				amount: '19.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '11.[0-9]{2}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});

	test('It should Pay back on an existing Aave V3 Ethereum Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(1_000);
		await reloadUntilCorrect(app);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'ETH', amount: '5' },
			expectedCollateralExposure: {
				amount: '19.[0-9]{2}',
				token: 'WSTETH',
			},
			expectedDebt: {
				amount: '6.[0-9]{2}',
				token: 'ETH',
			},
			protocol: 'Aave V3',
		});
	});
});
