import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { manageDebtOrCollateral, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'WSTETH',
				balance: '30',
			});
		});

		await app.page.goto('/ethereum/morphoblue/borrow/WSTETH-USDC#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '10' },
			borrow: { token: 'USDC', amount: '8000.12' },
			protocol: 'Morpho Blue',
		});
	});

	test('It should Deposit and Borrow in a single tx on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
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

	test('It should Withdraw and Pay back in a single tx on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
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

	test('It should Borrow and Deposit in a single tx on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
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

	test('It should Pay back and Withdraw in a single tx on an existing Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
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

	test('It should allow to simulate a Morpho Blue Borrow position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxxx',
		});

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
