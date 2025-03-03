import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave V3 Borrow - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '50',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Aave V3 Borrow Ethereum position - WSTETH/USDT @regression', async ({
		metamask,
		metamaskPage,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/ethereum/aave/v3/borrow/WSTETH-USDT#setup');

		await test.step('It should open a position', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'WSTETH', amount: '7.5' },
				borrow: { token: 'USDT', amount: '3000' },
				metamaskPage,
			});
		});

		await test.step('It should Deposit and Borrow in a single tx', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				allowanceNotNeeded: true,
				deposit: { token: 'WSTETH', amount: '1.5' },
				borrow: { token: 'USDT', amount: '1000' },
				expectedCollateralDeposited: {
					amount: '9.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '4,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
				protocol: 'Aave V3',
			});
		});

		await test.step('It should Withdraw and Pay back in a single tx', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'WSTETH', amount: '2' },
				payBack: { token: 'USDT', amount: '2000' },
				expectedCollateralDeposited: {
					amount: '7.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '2,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
				protocol: 'Aave V3',
				metamaskPage,
			});
		});

		// Pause to avoid flakiness
		await app.page.waitForTimeout(2_000);

		await test.step('It should Borrow and Deposit in a single tx', async () => {
			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				allowanceNotNeeded: true,
				borrow: { token: 'USDT', amount: '3000' },
				deposit: { token: 'WSTETH', amount: '3' },
				expectedCollateralDeposited: {
					amount: '10.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
				protocol: 'Aave V3',
			});
		});

		// Pause to avoid flakiness
		await app.page.waitForTimeout(2_000);

		await test.step('It should Pay back and Withdraw in a single tx', async () => {
			// Reload page to avoid random fails
			await app.page.reload();

			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBackDebt();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(2_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				payBack: { token: 'USDT', amount: '4000' },
				withdraw: { token: 'WSTETH', amount: '1.5' },
				expectedCollateralDeposited: {
					amount: '8.50',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDT' },
				protocol: 'Aave V3',
				allowanceNotNeeded: true,
			});
		});

		// Pause to avoid flakiness
		await app.page.waitForTimeout(2_000);

		await test.step('It should close a position', async () => {
			// Pause and relaod to avoid random fails
			await app.page.waitForTimeout(1000);
			await app.page.reload();

			await close({
				metamask,
				vtId,
				app,
				positionType: 'Borrow',
				closeTo: 'collateral',
				collateralToken: 'WSTETH',
				debtToken: 'USDT',
				tokenAmountAfterClosing: '[4-8].[0-9]{3,4}',
			});
		});
	});
});
