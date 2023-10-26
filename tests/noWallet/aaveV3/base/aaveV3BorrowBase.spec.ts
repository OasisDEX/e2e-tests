import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Base', async () => {
	test('It should allow to simulate an Aave V3 Borrow Base position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12453',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/borrow/ethusdbc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '15' });

		/* Asserting that Borrow Cost After pill will be a percentage:
			- negative 
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> -x.xx%
		*/
		await app.position.overview.shouldHaveBorrowCostAfterPill(/^-[0-9]\.[0-9]{2}/);
		/* Asserting that Net Value After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands- > xx,xxx
			- x2 digits decimal part 
			--> xx,xxx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill(/[1-8][0-9]\,[0-9]{3}\.[0-9]{2}/);
		await app.position.overview.shouldHaveExposureAfterPill({ amount: '15.00000', token: 'ETH' });
		/* Asserting that Max borring amount will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands 
			- x2 digits decimal part 
			--> xx,xxx.xx
		*/
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDBC',
			amount: '[1-9][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'ETH',
			current: '0.00000',
			future: '15.00000',
		});

		await app.position.setup.borrow({ token: 'USDBC', amount: '7000' });

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
		await app.position.overview.shouldHaveNetValueAfterPill(/[1-5][0-9]\,[0-9]{3}\.[0-9]{2}/);
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '7,000.0000', token: 'USDBC' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDBC',
			current: '0.00',
			future: '7,000.00',
		});
		/* Asserting that LTV future value is a number:
			- x2 digit2 whole-number part --> 1x
			- x2 digits decimal part 
			--> 1x.xx
		*/
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-6][0-9].[0-9]{2}',
		});
	});
});
