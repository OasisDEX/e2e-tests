import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Ethereum', async () => {
	test('It should allow to simulate an Aave V3 Ethereum Borrow position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11052',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		await app.position.overview.shouldHaveBorrowCostAfterPill('-[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({ amount: '50.00000', token: 'ETH' });
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDC',
			amount: '[1-9][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'ETH',
			current: '0.00000',
			future: '50.00000',
		});

		await app.position.setup.borrow({ token: 'USDC', amount: '10000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-9][0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-9][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[5-9][0-9],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '10,000.0000', token: 'USDC' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDC',
			current: '0.00',
			future: '10,000.00',
		});
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '1[0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11613',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/wbtcusdc#simulate');
		await app.position.setup.deposit({ token: 'WBTC', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	test('It should validate "Borrow <quote>" field - Over maximum borrowing amount @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11625',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc#simulate');
		await app.position.setup.borrow({ token: 'USDC', amount: '50' });
		await app.position.setup.shouldHaveError('You cannot borrow more than 0.00 USDC');
	});
});
