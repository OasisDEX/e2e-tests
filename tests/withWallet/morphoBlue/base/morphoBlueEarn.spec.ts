import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
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

test.describe('Morpho Blue Base - Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'base' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'base',
			walletAddress,
			token: 'CBETH',
			balance: '100',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage a Morpho Blue Base Earn position - CBETH/ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/base/morphoblue/multiply/CBETH-ETH#setup');

		await test.step('It should open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'CBETH', amount: '10' },
				protocol: 'Morpho Blue',
			});
		});

		await test.step('It should Deposit extra collateral', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'CBETH', amount: '2' },
				allowanceNotNeeded: true,
				expectedCollateralExposure: {
					amount: '1[2-3].[0-9]{2}',
					token: 'CBETH',
				},
			});
		});

		await test.step('It should Withdraw collateral', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');
			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'CBETH', amount: '2' },
				allowanceNotNeeded: true,
				expectedDebt: {
					amount: '1.[0-9]{3,4}',
					token: 'ETH',
				},
			});
		});

		await test.step('It should close a postion', async () => {
			await app.page.waitForTimeout(1_000);

			await close({
				metamask,
				forkId,
				app,
				closeTo: 'collateral',
				collateralToken: 'CBETH',
				debtToken: 'ETH',
				tokenAmountAfterClosing: '(1)?[0-9].[0-9]{3,4}',
			});
		});
	});
});
