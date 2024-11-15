import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));

test.describe('Morpho Blue Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'mainnet' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'mainnet',
			walletAddress,
			token: 'WSTETH',
			balance: '30',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage a Morpho Blue Borrow WSTETH-USD position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/borrow/WSTETH-USDC#setup');

		await test.step('It should Open a position', async () => {
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '10' },
				borrow: { token: 'USDC', amount: '8000.12' },
				protocol: 'Morpho Blue',
			});
		});

		await test.step('Deposit and Borrow in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				deposit: { token: 'WSTETH', amount: '10' },
				borrow: { token: 'USDC', amount: '10000' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '20.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '18,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Withdraw and Pay back in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.withdrawCollateral();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				withdraw: { token: 'WSTETH', amount: '5' },
				payBack: { token: 'USDC', amount: '5000' },
				expectedCollateralDeposited: {
					amount: '15.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '1[2-3],[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Borrow and Deposit in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				borrow: { token: 'USDC', amount: '10000' },
				deposit: { token: 'WSTETH', amount: '10' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '25.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '23,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});

		await test.step('Pay back and Withdraw in a single tx', async () => {
			await app.page.waitForTimeout(1_000);

			await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBackDebt();

			await manageDebtOrCollateral({
				metamask,
				app,
				forkId,
				payBack: { token: 'USDC', amount: '5000' },
				withdraw: { token: 'WSTETH', amount: '5' },
				allowanceNotNeeded: true,
				expectedCollateralDeposited: {
					amount: '20.00',
					token: 'WSTETH',
				},
				expectedDebt: { amount: '18,[0-9]{3}.[0-9]{1,2}', token: 'USDC' },
			});
		});
	});
});

test.describe('Morpho Blue Borrow - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		app = new App(page);
		await setup({ metamask, app, network: 'mainnet', withoutFork: true });
	});

	test('It should allow to simulate a Morpho Blue Borrow position before opening it @regression', async () => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/morphoblue/borrow/WSTETH-ETH#setup');

		await app.position.setup.deposit({ token: 'WSTETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 WSTETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'WSTETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'ETH', amount: '8.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-1].[0-9]{3,4} WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[4-9][0-9].[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '8.1234',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[0-4].[0-9]{3,4}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-4].[0-9]{3,4}',
			token: 'ETH',
		});

		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'WSTETH/ETH',
			current: '0.00',
			future: '[0-2].[0-9]{3,4}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Morpho Blue',
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '8.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WSTETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
	});
});
