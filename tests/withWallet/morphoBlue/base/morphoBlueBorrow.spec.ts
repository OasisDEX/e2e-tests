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
				token: 'ETH',
				balance: '30',
			});
		});

		await app.page.goto('/base/morphoblue/borrow/ETH-USDC#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '5' },
			borrow: { token: 'USDC', amount: '5000' },
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
			deposit: { token: 'ETH', amount: '1' },
			borrow: { token: 'USDC', amount: '1000' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '6.00',
				token: 'ETH',
			},
			expectedDebt: { amount: '6,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
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
			withdraw: { token: 'ETH', amount: '1' },
			payBack: { token: 'USDC', amount: '1000' },
			expectedCollateralDeposited: {
				amount: '5.00',
				token: 'ETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Morpho Blue Borrow Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			borrow: { token: 'USDC', amount: '1000' },
			deposit: { token: 'ETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '6.00',
				token: 'ETH',
			},
			expectedDebt: { amount: '6,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Morpho Blue Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			allowanceNotNeeded: true,
			payBack: { token: 'USDC', amount: '1000' },
			withdraw: { token: 'ETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '5.00',
				token: 'ETH',
			},
			expectedDebt: { amount: '5,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
		});
	});
});
