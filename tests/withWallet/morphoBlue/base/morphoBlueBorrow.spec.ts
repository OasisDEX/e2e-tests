import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Base - Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Morpho Blue Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'base',
				walletAddress,
				token: 'CBETH',
				balance: '30',
			});
		});

		await app.page.goto('/base/morphoblue/borrow/CBETH-USDC#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '10' },
			borrow: { token: 'USDC', amount: '10000' },
			protocol: 'Morpho Blue',
		});
	});

	test('It should Deposit and Borrow in a single tx on an existing Morpho Blue Base Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '5' },
			borrow: { token: 'USDC', amount: '5000' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '15.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '15,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});

	test('It should Withdraw and Pay back in a single tx on an existing Morpho Blue Base Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'CBETH', amount: '5' },
			payBack: { token: 'USDC', amount: '5000' },
			expectedCollateralDeposited: {
				amount: '10.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '10,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Morpho Blue Borrow Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'USDC', amount: '5000' },
			deposit: { token: 'CBETH', amount: '5' },
			expectedCollateralDeposited: {
				amount: '15.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '15,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Morpho Blue Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'CBETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			payBack: { token: 'USDC', amount: '5000' },
			withdraw: { token: 'CBETH', amount: '5' },
			expectedCollateralDeposited: {
				amount: '10.00',
				token: 'CBETH',
			},
			expectedDebt: { amount: '10,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});
});
