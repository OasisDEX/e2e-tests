import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Aave V3 Borrow - Base - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'base' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and magage an Aave V3 Borrow Base position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(gigaTestTimeout);

		await app.page.goto('/base/aave/v3/borrow/eth-usdbc#simulate');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '9.12345' },
				borrow: { token: 'USDBC', amount: '2000' },
			});
		});

		// Skip again if DB collision also happening with omni
		await test.step('It should Deposit and Borrow in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
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

		await test.step('It should Withdraw and Pay back in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
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

		await test.step('It should Borrow and Deposit in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
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

		await test.step('It should Pay back and Withdraw in a single tx', async () => {
			// Reload page to avoid random fails
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
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

		// Skip again if DB collision also happening with omni
		await test.step('It should Close a position', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.reload();
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
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
});
