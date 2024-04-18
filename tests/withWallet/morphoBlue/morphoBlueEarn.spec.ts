import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Morpho Blue Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'USDT',
				balance: '100000',
			});
		});

		await app.page.goto('/ethereum/erc-4626/earn/steakhouse-USDT#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'USDT', amount: '20000' },
		});
	});

	test('It should Deposit (same token - USDT) on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'USDT', amount: '10000' },
			allowanceNotNeeded: true,
			expectedAvailableToWithdraw: {
				amount: '[2-3][0-9],[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			},
		});
	});

	test('It should Withdraw from an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'USDT', amount: '20000' },
			allowanceNotNeeded: true,
			expectedAvailableToWithdraw: {
				amount: '(1)?[0-9],[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			},
		});
	});

	test('It should Deposit (different token - ETH) on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.setup.openTokenSelector();
		await app.position.setup.selectDepositToken('ETH');

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '80' },
			allowanceNotNeeded: true,
			expectedAvailableToWithdraw: {
				amount: '[0-9]{3},[0-9]{3}.[0-9]{2}',
				token: 'USDT',
			},
		});
	});
});
