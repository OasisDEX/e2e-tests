import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	depositAndBorrow,
	openPosition,
	withdrawAndPayBack,
} from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Arbitrum Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Arbitrum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'arbitrum',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'arbitrum',
				token: 'RETH',
				balance: '100',
			});
		});
		await app.page.goto('/arbitrum/ajna/borrow/RETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'RETH', amount: '0.1' },
			borrow: { token: 'ETH', amount: '0.01' },
		});
	});

	test('It should Deposit and Borrow in a single tx form an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await depositAndBorrow({
			app,
			forkId,
			deposit: { token: 'RETH', amount: '0.1' },
			borrow: { token: 'ETH', amount: '0.05' },
			expectedCollateralDeposited: {
				amount: '0.20',
				token: 'RETH',
			},
			expectedDebt: { amount: '0.06([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Withdraw and Pay back in a single tx form an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await withdrawAndPayBack({
			app,
			forkId,
			withdraw: { token: 'RETH', amount: '0.1' },
			payback: { token: 'ETH', amount: '0.01' },
			expectedCollateralDeposited: {
				amount: '0.10',
				token: 'RETH',
			},
			expectedDebt: { amount: '0.05([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
		await app.position.manage.select('Manage debt');

		await depositAndBorrow({
			app,
			forkId,
			borrow: { token: 'ETH', amount: '0.02' },
			deposit: { token: 'RETH', amount: '0.2' },
			expectedCollateralDeposited: {
				amount: '0.30',
				token: 'RETH',
			},
			expectedDebt: { amount: '0.07([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.payBackDebt();

		await withdrawAndPayBack({
			app,
			forkId,
			payback: { token: 'ETH', amount: '0.01' },
			withdraw: { token: 'RETH', amount: '0.1' },
			expectedCollateralDeposited: {
				amount: '0.20',
				token: 'RETH',
			},
			expectedDebt: { amount: '0.06([0-9]{1,2})?', token: 'ETH' },
		});
	});

	// !! tx failing with very low liquidity - To re-test when liquidity rises
	test.skip('It should Close to collateral an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await close({
			app,
			forkId,
			positionType: 'Borrow',
			closeTo: 'collateral',
			collateralToken: 'RETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '0.[0-9]{3,4}',
		});
	});

	//TEST
});
