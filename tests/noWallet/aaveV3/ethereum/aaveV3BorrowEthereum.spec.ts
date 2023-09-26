import { test } from '#noWalletFixtures';

test.describe('Aave v3 Borrow Ethereum', async () => {
	test('It should allow to simulate a position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11052',
			},
			{ type: 'Bug', description: '11784' }
		);

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		/* Asserting that Borrow Cost After pill will be a percentage:
			- negative 
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> -x.xx%
		*/
		await app.position.overview.shouldHaveBorrowCostAfterPill(/^-[0-9]\.[0-9]{2}/);
		/* Asserting that Net Value After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands- > 8x,xxx
			- x2 digits decimal part 
			--> 8x,xxx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill(/[7-8][0-9]\,[0-9]{3}\.[0-9]{2}/);

		// !!! SKIPPED test because of bug - 11784
		// await app.position.overview.shouldHaveExposureAfterPill({ amount: '50.00000', token: 'ETH' });
		/* Asserting that Max borring amount will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands 
			- x2 digits decimal part 
			--> xx,xxx.xx
		*/
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

		/* Asserting that Liquidation Price After pill will be:
			- x3 digits whole-number part
			- x2 digits decimal part 
			--> xxx.xx
		*/
		await app.position.overview.shouldHaveLiquidationPriceAfterPill(/[1-9][0-9]{2}\.[0-9]{2}/);
		/* Asserting that Loan to Value After pill will be a percentage:
			- x2 digits whole-number part
			- x2 digits decimal part 
			--> xx.xx%
		*/
		await app.position.overview.shouldHaveLoanToValueAfterPill(/[1-9][0-9]\.[0-9]{2}%/);
		/* Asserting that Net Value After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands- > 7x,xxx
			- x2 digits decimal part 
			--> 8x,xxx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill(/[6-7][0-9]\,[0-9]{3}\.[0-9]{2}/);
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '10,000.0000', token: 'USDC' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDC',
			current: '0.00',
			future: '10,000.00',
		});
		/* Asserting that LTV future value is a number:
			- x2 digit2 whole-number part --> 1x
			- x2 digits decimal part 
			--> 1x.xx
		*/
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '1[0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet @regression', async ({
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
