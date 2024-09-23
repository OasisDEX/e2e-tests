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

test.describe('Morpho Blue Base - Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Morpho Blue Base Earn position - CBETH/ETH @regression', async () => {
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
				balance: '100',
			});
		});

		await app.position.openPage('/base/morphoblue/multiply/CBETH-ETH#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '10' },
		});
	});

	test('It should Deposit on an existing Morpho Blue Base Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '2' },
			allowanceNotNeeded: true,
			expectedCollateralExposure: {
				amount: '1[2-3].[0-9]{2}',
				token: 'CBETH',
			},
		});
	});

	test('It should Withdraw from an existing Morpho Blue Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'CBETH', amount: '2' },
			allowanceNotNeeded: true,
			expectedDebt: {
				amount: '1.[0-9]{3,4}',
				token: 'ETH',
			},
		});
	});

	test('It should Close to collateral an existing Morpho Blue Base Earn position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await close({
			forkId,
			app,
			closeTo: 'collateral',
			collateralToken: 'CBETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '(1)?[0-9].[0-9]{3,4}',
		});
	});
});
