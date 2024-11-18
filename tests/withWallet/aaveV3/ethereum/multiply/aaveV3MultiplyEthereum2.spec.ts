import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, manageDebtOrCollateral } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'mainnet',
			token: 'RETH',
			balance: '100',
		});

		await tenderly.changeAccountOwner({
			account: '0x6bb713b56e73a115164b4b56ea1f5a76640c4d19',
			newOwner: walletAddress,
			forkId,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should manage an existing Aave V3 Multiply Ethereum position', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/reth-dai/1276#overview');

		await test.step('Deposit extra collateral', async () => {
			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.shouldHaveTab('Protection ON');

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'RETH', amount: '50' },
				expectedCollateralExposure: {
					amount: '50.[0-9]{1,2}',
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
				forkId,
				withdraw: { token: 'RETH', amount: '8' },
				expectedCollateralExposure: {
					amount: '4[1-2].[0-9]{1,2}',
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
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.withdrawDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				borrow: { token: 'DAI', amount: '40000' },
				expectedDebt: { amount: '40,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Pay back', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.reduceDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'DAI', amount: '32000' },
				expectedDebt: { amount: '8,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Aave V3',
			});
		});

		await test.step('Close position', async () => {
			// Pause and Reload page to avoid random fails
			await app.page.waitForTimeout(3_000);
			await app.page.reload();

			// Pause to avoid flakiness
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				app,
				forkId,
				positionType: 'Multiply',
				closeTo: 'collateral',
				collateralToken: 'RETH',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '[0-9]{2}.[0-9]{1,2}([0-9]{1,2})?',
			});
		});
	});
});
