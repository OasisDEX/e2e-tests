import { test } from '#fixtures';

test.describe('Aave v3 Borrow', async () => {
	test('It should allow to simulate a position before opening it - No wallet connected @regression', async ({
		browserName,
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11052',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		if (['firefox', 'webkit'].includes(browserName)) {
			await app.page.waitForTimeout(3000);
		} else {
			await app.page.waitForTimeout(1500);
		}

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
		await app.position.overview.shouldHaveNetValueAfterPill(/8[0-9]\,[0-9]{3}\.[0-9]{2}/);
		await app.position.overview.shouldHaveExposureAfterPill({ amount: '50.00000', token: 'ETH' });
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
		await app.position.overview.shouldHaveNetValueAfterPill(/7[0-9]\,[0-9]{3}\.[0-9]{2}/);
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
});
