import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { gigaTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, manageDebtOrCollateral } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'RETH',
			balance: '10',
		});

		await tenderly.changeAccountOwner({
			account: '0x6bb713b56e73a115164b4b56ea1f5a76640c4d19',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should manage an existing Aave V3 Multiply Ethereum position', async ({ metamask }) => {
		test.setTimeout(gigaTestTimeout);

		// await app.page.goto('/ethereum/aave/v3/multiply/reth-dai/1276#overview');
		await app.position.openPage('/ethereum/aave/v3/multiply/reth-dai/1276#overview');

		await test.step('Deposit extra collateral', async () => {
			await app.position.shouldHaveTab('Protection OFF');

			// Pause to avoid flakiness - as page reloads
			await app.page.waitForTimeout(2_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			// Pause to avoid flakiness
			await app.page.waitForTimeout(3_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'RETH', amount: '2' },
				expectedCollateralExposure: {
					amount: '[1-2].[0-9]{4}',
					token: 'RETH',
				},
				protocol: 'Aave V3',
			});
		});

		await test.step('Withdraw', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'RETH', amount: '1' },
				expectedCollateralExposure: {
					amount: '[0-1].[0-9]{4}',
					token: 'RETH',
				},
				protocol: 'Aave V3',
			});
		});

		await test.step('Borrow more', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(3_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.withdrawDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				borrow: { token: 'DAI', amount: '1000' },
				expectedDebt: { amount: '1,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Pay back', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(3_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.reduceDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				payBack: { token: 'DAI', amount: '500' },
				expectedDebt: { amount: '5[0-9]{2}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Close position', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(3_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Multiply',
				closeTo: 'collateral',
				collateralToken: 'RETH',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '[0-9].[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
