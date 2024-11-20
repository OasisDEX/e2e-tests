import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
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
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Ajna Base Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({
			metamask,
			app,
			network: 'base',
			extraFeaturesFlags: 'AjnaSuppressValidation:true',
		}));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'base',
			token: 'WSTETH',
			balance: '100',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open an Ajna Base Borrow position @regression', async ({ metamask }) => {
		test.setTimeout(gigaTestTimeout);

		await test.step('Setup test - Open Earn position to provide liquidity', async () => {
			await app.position.openPage('/base/ajna/earn/WSTETH-ETH#setup');
			await app.position.setup.acknowledgeAjnaInfo();

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '10' },
				protocol: 'Ajna',
			});
		});

		// Wait to make sure that liquidity added in previous test is actually up
		await app.page.waitForTimeout(5_000);

		await app.position.openPage('/base/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await test.step('Open Borrow position', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '2' },
				borrow: { token: 'ETH', amount: '1' },
				ajnaExistingDpm: true,
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '2' },
				borrow: { token: 'ETH', amount: '1' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '4.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '2.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'WSTETH', amount: '1' },
				payBack: { token: 'ETH', amount: '1' },
				expectedCollateralDeposited: {
					amount: '3.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
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
				forkId,
				borrow: { token: 'ETH', amount: '1' },
				deposit: { token: 'WSTETH', amount: '2' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '5.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '2.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
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
				forkId,
				payBack: { token: 'ETH', amount: '1' },
				withdraw: { token: 'WSTETH', amount: '3' },
				expectedCollateralDeposited: {
					amount: '2.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Close position', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				app,
				forkId,
				positionType: 'Borrow',
				closeTo: 'collateral',
				collateralToken: 'WSTETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}',
			});
		});
	});
});
