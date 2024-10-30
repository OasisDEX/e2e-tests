import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'arbitrum' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Borrow Arbitrum ETH/USDC position @regression', async ({
		metamask,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12068',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/borrow/eth-usdc#setup');

		await test.step('It should Open a position', async () => {
			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '7.5' },
				borrow: { token: 'USDC', amount: '2000' },
			});
		});

		await test.step('It should Deposit and Borrow in a single tx', async () => {
			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
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

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
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
