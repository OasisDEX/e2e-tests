import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

test.describe('Aave V3 Borrow - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId } = await setup({ metamask, app, network: 'arbitrum' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Borrow Arbitrum ETH/USDC position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/borrow/eth-usdc#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(4_000);

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '7.5' },
				borrow: { token: 'USDC', amount: '2000' },
			});
		});

		await test.step('It should Deposit and Borrow in a single tx', async () => {
			// Pause to avoid random fails
			await app.page.waitForTimeout(3_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				deposit: { token: 'ETH', amount: '1.5' },
				borrow: { token: 'USDC', amount: '3000' },
				expectedCollateralDeposited: {
					amount: '9.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDC' },
				protocol: 'Aave V3',
			});
		});

		await test.step('It should Withdraw and Pay back in a single tx', async () => {
			await app.position.manage.withdrawCollateral();

			// Pause to avoid random fails
			await app.page.waitForTimeout(3_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				vtId,
				withdraw: { token: 'ETH', amount: '2' },
				payBack: { token: 'USDC', amount: '1000' },
				expectedCollateralDeposited: {
					amount: '7.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '4,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'USDC' },
				protocol: 'Aave V3',
			});
		});
	});
});
