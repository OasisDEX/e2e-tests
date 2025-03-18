import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
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

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

// No liquidity - Enable when liquidity available
test.describe.skip('Ajna Arbitrum Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'arbitrum',
		}));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'arbitrum',
			token: 'RETH',
			balance: '10',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open and manage an Ajna Arbitrum Borrow RETH-ETH position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/arbitrum/ajna/borrow/RETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await test.step('Open position', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'RETH', amount: '0.1' },
				borrow: { token: 'ETH', amount: '0.01' },
				protocol: 'Ajna',
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'RETH', amount: '0.1' },
				borrow: { token: 'ETH', amount: '0.05' },
				expectedCollateralDeposited: {
					amount: '0.20',
					token: 'RETH',
				},
				expectedDebt: { amount: '0.06([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'RETH', amount: '0.1' },
				payBack: { token: 'ETH', amount: '0.01' },
				expectedCollateralDeposited: {
					amount: '0.10',
					token: 'RETH',
				},
				expectedDebt: { amount: '0.05([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				borrow: { token: 'ETH', amount: '0.02' },
				deposit: { token: 'RETH', amount: '0.2' },
				expectedCollateralDeposited: {
					amount: '0.30',
					token: 'RETH',
				},
				expectedDebt: { amount: '0.07([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
			await app.position.manage.select('Manage debt');

			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				payBack: { token: 'ETH', amount: '0.01' },
				withdraw: { token: 'RETH', amount: '0.1' },
				expectedCollateralDeposited: {
					amount: '0.20',
					token: 'RETH',
				},
				expectedDebt: { amount: '0.06([0-9]{1,2})?', token: 'ETH' },
			});
		});

		await test.step('Close position', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				app,
				vtId,
				positionType: 'Borrow',
				closeTo: 'collateral',
				collateralToken: 'RETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '0.[0-9]{3,4}',
			});
		});
	});
});
