import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
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
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Spark Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'mainnet',
			token: 'RETH',
			balance: '20',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open a Spark Borrow position - RETH/DAI @regression', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/spark/borrow/reth-dai#simulate');

		await test.step('Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'RETH', amount: '7.5' },
				borrow: { token: 'DAI', amount: '5000' },
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				allowanceNotNeeded: true,
				deposit: { token: 'RETH', amount: '1.5' },
				borrow: { token: 'DAI', amount: '1000' },
				expectedCollateralDeposited: {
					amount: '9.00',
					token: 'RETH',
				},
				expectedDebt: { amount: '6,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Spark',
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'RETH', amount: '1.5' },
				payBack: { token: 'DAI', amount: '1000' },
				expectedCollateralDeposited: {
					amount: '7.50',
					token: 'RETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Spark',
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'RETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				allowanceNotNeeded: true,
				borrow: { token: 'DAI', amount: '1000' },
				deposit: { token: 'RETH', amount: '1.5' },
				expectedCollateralDeposited: {
					amount: '9.00',
					token: 'RETH',
				},
				expectedDebt: { amount: '6,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Spark',
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			await app.page.waitForTimeout(2_000);

			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'DAI', amount: '1000' },
				withdraw: { token: 'RETH', amount: '1.5' },
				expectedCollateralDeposited: {
					amount: '7.50',
					token: 'RETH',
				},
				expectedDebt: { amount: '5,[0-9]{3}.[0-9]{2}([0-9]{1,2})?', token: 'DAI' },
				protocol: 'Spark',
				allowanceNotNeeded: true,
			});
		});

		await test.step('Close position', async () => {
			await app.page.waitForTimeout(2_000);

			await close({
				metamask,
				forkId,
				app,
				positionType: 'Borrow',
				openManagementOptionsDropdown: { currentLabel: 'DAI' },
				closeTo: 'debt',
				collateralToken: 'RETH',
				debtToken: 'DAI',
				tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
			});
		});
	});
});
