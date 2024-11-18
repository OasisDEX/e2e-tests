import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Morpho Blue Base - Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'base' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage a Morpho Blue Base Borrow position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/base/morphoblue/borrow/ETH-USDC#setup');

		await test.step('Open position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '5' },
				borrow: { token: 'USDC', amount: '5000' },
				protocol: 'Morpho Blue',
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '1' },
				borrow: { token: 'USDC', amount: '1000' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '6.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '6,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'ETH', amount: '1' },
				payBack: { token: 'USDC', amount: '1000' },
				expectedCollateralDeposited: {
					amount: '5.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				allowanceNotNeeded: true,
				borrow: { token: 'USDC', amount: '1000' },
				deposit: { token: 'ETH', amount: '1' },
				expectedCollateralDeposited: {
					amount: '6.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '6,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				allowanceNotNeeded: true,
				payBack: { token: 'USDC', amount: '1000' },
				withdraw: { token: 'ETH', amount: '1' },
				expectedCollateralDeposited: {
					amount: '5.00',
					token: 'ETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});
	});
});
