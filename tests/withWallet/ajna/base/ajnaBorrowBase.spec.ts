import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
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

test.describe('Ajna Base Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	// Test added to add pool liquidity and reduce flakiness of Borrow tests
	test('It should open an Ajna Base Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'base',
				extraFeaturesFlags: 'AjnaSuppressValidation:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'base',
				token: 'WSTETH',
				balance: '100',
			});
		});

		await app.page.goto('/base/ajna/earn/WSTETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			protocol: 'Ajna',
		});
	});

	test('It should open an Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// Wait to make sure that liquidity added in previous test is actually up
		await app.page.waitForTimeout(5_000);

		await app.page.goto('/base/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			app,
			forkId,
			existingDPM: true,
			deposit: { token: 'WSTETH', amount: '2' },
			borrow: { token: 'ETH', amount: '1' },
		});
	});

	test('It should Deposit and Borrow in a single tx from an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await manageDebtOrCollateral({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '2' },
			borrow: { token: 'ETH', amount: '1' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '4.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '2.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Withdraw and Pay back in a single tx from an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.withdrawCollateral();

		await manageDebtOrCollateral({
			app,
			forkId,
			withdraw: { token: 'WSTETH', amount: '1' },
			payBack: { token: 'ETH', amount: '1' },
			expectedCollateralDeposited: {
				amount: '3.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Borrow and Deposit in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await manageDebtOrCollateral({
			app,
			forkId,
			borrow: { token: 'ETH', amount: '1' },
			deposit: { token: 'WSTETH', amount: '2' },
			allowanceNotNeeded: true,
			expectedCollateralDeposited: {
				amount: '5.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '2.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Pay back and Withdraw in a single tx on an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'WSTETH' });
		await app.position.manage.select('Manage debt');

		await app.position.manage.payBackDebt();

		await manageDebtOrCollateral({
			app,
			forkId,
			payBack: { token: 'ETH', amount: '1' },
			withdraw: { token: 'WSTETH', amount: '3' },
			expectedCollateralDeposited: {
				amount: '2.00',
				token: 'WSTETH',
			},
			expectedDebt: { amount: '1.[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
		});
	});

	test('It should Close to collateral an existing Ajna Base Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

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

	test('It should allow to simulate an Ajna Base Borrow position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.page.goto('/base/ajna/borrow/ETH-USDC#setup');

		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 ETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '10.12',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDC',
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'ETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'USDC', amount: '10,000.12' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-3],[0-9]{3}.[0-9]{2} ETH/USDC'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[2-7][0-9].[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '10,000.12',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[2-8].[0-9]{3,4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
			token: 'USDC',
		});

		await app.position.setup.shouldHaveOriginationFee({
			token: 'USDC',
			tokenAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'ETH/USDC',
			current: '0.00',
			future: '([1-2],)?[0-9]{3}.[0-9]{1,2}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Ajna',
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '10,0[0-9]{2}.[0-9]{1,2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'ETH',
			current: '0.00',
			future: '[2-8].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
	});
});
