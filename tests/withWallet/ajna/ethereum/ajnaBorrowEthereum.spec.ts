import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import {
	close,
	manageDebtOrCollateral,
	openPosition,
} from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Ethereum Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12103',
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
				balance: '100',
			});
		});

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '2' },
			borrow: { token: 'ETH', amount: '1' },
		});
	});

	test('It should Deposit and Borrow in a single tx from an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '1.5' },
			borrow: { token: 'ETH', amount: '0.5' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '3.50',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'WSTETH', amount: '1' },
			payBack: { token: 'ETH', amount: '0.8' },
			expectedCollateralDeposited: {
				amount: '2.50',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '0.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Ajna Ethereum Borrow position @regression', async () => {
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
			borrow: { token: 'ETH', amount: '1' },
			deposit: { token: 'WSTETH', amount: '2' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '4.50',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Ajna Ethereum Borrow position @regression', async () => {
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
			payBack: { token: 'ETH', amount: '1.1' },
			withdraw: { token: 'WSTETH', amount: '1.5' },
			expectedCollateralDeposited: {
				amount: '3.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '0.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Close to collateral an existing Ajna Ethereum Borrow position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await close({
			app,
			forkId,
			positionType: 'Borrow',
			closeTo: 'collateral',
			collateralToken: 'WSTETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}',
		});
	});

	test('It should allow to simulate an Ajna Ethereum Borrow position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12732',
		});

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.openNewPosition();

		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 WSTETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '10.12',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{2}([0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'WSTETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WSTETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}([0-9]{1,2})?',
		});

		await app.position.setup.borrow({ token: 'ETH', amount: '1.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-3].[0-9]{3,4} WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '1.1234',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[5-9].[0-9]{3,4}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveOriginationFee({
			token: 'ETH',
			tokenAmount: '0.[0-9]{4}',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'WSTETH/ETH',
			current: '0.00',
			future: '[0-2].[0-9]{3,4}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Ajna',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '1.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WSTETH',
			current: '0.00',
			future: '[5-9].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}([0-9]{1,2})?',
		});
	});
});
