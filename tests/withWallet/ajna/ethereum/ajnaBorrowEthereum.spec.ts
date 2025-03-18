import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	manageDebtOrCollateral,
	close,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Ajna Ethereum Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
		}));

		await tenderly.setTokenBalance({
			vtRPC,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await app.page.close();
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Ajna Ethereum Borrow position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await test.step('Open position', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'WSTETH', amount: '2' },
				borrow: { token: 'ETH', amount: '1' },
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'WSTETH', amount: '1.5' },
				borrow: { token: 'ETH', amount: '0.5' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '3.50',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'WSTETH', amount: '1' },
				payBack: { token: 'ETH', amount: '0.8' },
				expectedCollateralDeposited: {
					amount: '2.50',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '0.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				borrow: { token: 'ETH', amount: '1' },
				deposit: { token: 'WSTETH', amount: '2' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '4.50',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');

			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				payBack: { token: 'ETH', amount: '1.1' },
				withdraw: { token: 'WSTETH', amount: '1.5' },
				expectedCollateralDeposited: {
					amount: '3.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '0.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Close position', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Borrow',
				closeTo: 'collateral',
				collateralToken: 'WSTETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}',
			});
		});
	});
});
