import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, positionTimeout } from 'utils/config';
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

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn Ethereum position @regression', async () => {
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

		await app.page.goto('/ethereum/omni/aave/v3/multiply/wsteth-eth#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			omni: { network: 'ethereum' },
		});
	});

	test('It should Deposit etxra collateral on an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

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

	test('It should Withdraw from an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

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

	test('It should Borrow from an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
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

	test('It should Pay back on an existing Aave V3 Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// Reload page to avoid random fails
		await app.page.reload();

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

	test('It should adjust risk of an existing Aave V3 Earn Ethereum position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13060',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			earnPosition: true,
			risk: 'up',
			newSliderPosition: 0.8,
		});
	});

	test('It should adjust risk of an existing Aave V3 Earn Ethereum position - Down', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13061',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			earnPosition: true,
			risk: 'down',
			newSliderPosition: 0.2,
		});
	});

	test('It should close an existing Aave V3 Earn Ethereum position - Close to collateral token (WSTETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13062',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Earn',
			closeTo: 'collateral',
			collateralToken: 'WSTETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9]{2}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});

	test.skip('It should list an opened Aave V3 Earn Ethereum position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11673',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.earn.shouldHaveHeaderCount('1');
		// await app.portfolio.earn.vaults.first.shouldHave({ assets: 'WSTETH/ETH' });
	});

	test.skip('It should open an Aave V3 Earn Ethereum position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11681',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);
		// await app.portfolio.earn.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage ');
	});
});
