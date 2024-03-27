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

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12473',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'base' }));
		});

		await app.page.goto('/base/omni/aave/v3/borrow/eth-usdbc#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '9.12345' },
			borrow: { token: 'USDBC', amount: '2000' },
			omni: { network: 'base' },
		});
	});

	// Skip again if DB collision also happeningwith omni
	test('It should Deposit and Borrow in a single tx from an existing Aave V3 Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13035',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '1' },
			borrow: { token: 'USDBC', amount: '3000' },
			expectedCollateralDeposited: {
				amount: '10.12',
				token: 'ETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDBC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Aave V3 Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'ETH', amount: '2' },
			payBack: { token: 'USDBC', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '8.12',
				token: 'ETH',
			},
			expectedDebt: { amount: '4,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDBC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Aave V3 Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'USDBC', amount: '2000' },
			deposit: { token: 'ETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '9.12',
				token: 'ETH',
			},
			expectedDebt: { amount: '6,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDBC' },
			protocol: 'Aave V3',
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Aave V3 Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
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
			payBack: { token: 'USDBC', amount: '3000' },
			withdraw: { token: 'ETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '7.62',
				token: 'ETH',
			},
			expectedDebt: { amount: '3,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDBC' },
			protocol: 'Aave V3',
			allowanceNotNeeded: true,
		});
	});

	// Skip again if DB collision also happeningwith omni
	test('It should close an existent Aave V3 Borrow Base position - Close to collateral token (CBETH)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13067',
		});

		test.setTimeout(longTestTimeout);

		// Pause and Reload page to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Borrow',
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDBC',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}',
		});
	});
});
