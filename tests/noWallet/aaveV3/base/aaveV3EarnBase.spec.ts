import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Earn Base', async () => {
	test('It should allow to simulate an Aave V3 Base Earn position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12460',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/earn/cbetheth');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'CBETH', amount: '16.12345' });

		/* Asserting that Liquidation Price After pill will be:
			- x1 digits whole-number part --> x
			- x2 digits decimal part 
			--> x.xx
		*/
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9].[0-9]{2}');
		/* Asserting that Loan to Value After pill will be a percentage:
			- x2 digits whole-number part --> [1/2/3/4/5]x
			- x2 digits decimal part 
			--> [1/2/3/4/5]x.xx%%
		*/
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-5][0-9].[0-9]{2}%');
		/* Asserting that Borrow Cost After pill will be a percentage:
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> x.xx%
		*/
		await app.position.overview.shouldHaveBorrowCostAfterPill('[0-9].[0-9]{2}');
		/* Asserting that Net Value After pill will be a number:
			- x2 digits whole-number part -> xx
			- x2 digits decimal part 
			--> xx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2}.[0-9]{2}');
		/* Asserting that Total Exposure After pill will be a number:
			- x2 digit whole-number part -> xx
			- x5 digits decimal part 
			--> x.xxxxx
		*/
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[0-9]{2}.[0-9]{5}',
			token: 'CBETH',
		});
		/* Asserting that Position Debt After pill will be a number:
			- x1 digit whole-number part -> x
			- x4 digits decimal part 
			--> x.xxxx
		*/
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-9].[0-9]{4}',
			token: 'ETH',
		});
		/* Asserting that Multiple After pill will be a number:
			- x1 digit whole-number part -> 1
			- x0 or x1 or x2 digit decimal part 
			--> 1 or 1.x or 1.xx
		*/
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		/* Asserting that Buying Power After pill will be a number:
			- x4 or x5 digits whole-number part, with a ',' separator for thousands -> xx,xxx or x,xxx
			- 0, x1 or x2 digits decimal part 
		*/
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})?',
		});

		/* Asserting that Liquidation price is a number:
     		- x6 digits whole-number part, with a ',' separator for thousands -> 1xx,xxx
			- x1 or x2 digits decimal part 
			--> [4/5/6/7/8],xxx.xx
		*/
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9].[0-9]{4} CBETH',
		});
		/* Asserting that Liquidation price is a number:
			- x2 digits whole-number part
			- x1 digit decimal part 
			--> xx.x
		*/
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');

		/* Asserting that Buying amount in token value is a number:
			- x4 digits whole-number part --> 1,xxx
			- x4 digits decimal part 
			--> 1,xxx.xxxx
			Asserting that Buying amount in $ is a number:
			- x4 digits whole-number part, with a ',' separator for thousands -> 1,xxx
			- x2 digits decimal part 
			--> 1,xxx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-9].[0-9]{5}',
			token: 'CBETH',
			dollarsAmount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		/* Asserting that Flashloan Amount is a number:
			- x1/x2 digits whole-number part -> 'x' or 'xx'
			- x5 digits decimal part 
			--> x.xxxxx or xx.xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveFlashloanAmount({
			amount: '[0-9]{1,2}.[0-9]{5}',
			token: 'WETH',
		});
		/* Asserting that Flashloan Provider Liquidity is a number:
			- x2/x3/x4 digits whole-number part -> 'xx' or 'xxx' or 'xxxx'
			- x5 digits decimal part 
			--> xx.xxxxx or xxx.xxxxx or xxxx.xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveFlashloanProviderLiquidity({
			amount: '([1-9],)?[0-9]{3}.[0-9]{5}',
			token: 'WETH',
		});
		/* Asserting that Price impact amount is a number:
			- x1 digit whole-number part -> 'x'
			- x4 digits decimal part 
			--> x.xxxx
			Asserting that Price impact percentage is a number:
			- x1 digit whole-number part -> '0'
			- x2 digits decimal part 
			--> 0.xx
		*/
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-9].[0-9]{4}',
			percentage: '0.[0-9]{2}',
		});
		/* Asserting that Slipage limit percentage is a number:
			- x1 digit whole-number part -> '0'
			- x2 digits decimal part 
			--> 0.xx
		*/
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		/* Asserting that Multiply future value is a number:
			- x1 digit whole-number part --> [1/2]
			- none or x1 or x2 digits decimal part 
			--> [1/2] or [1/2].x or [1/2].xx
		*/
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		/* Asserting that Outstanding Debt future value is a number:
			- x1 digit whole-number part -> '[1-9]'
			- x5 digits decimal part 
			--> [1-9].xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'ETH',
			current: '0.00000',
			future: '[1-9].[0-9]{5}',
		});
		/* Asserting that Total collateral future value is a number:
			- x4 digits whole-number part, with comma for thousands separator -> [4-9],xxx
			- x4 digits decimal part 
			--> [2/3].xxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'CBETH',
			current: '0.00000',
			future: '[0-9]{2}.[0-9]{5}',
		});
		/* Asserting that LTV future value is a number:
			- x2 digits whole-number part -> xx
			- x2 digits decimal part 
			--> xx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-6][0-9].[0-9]{2}',
		});
		/* Asserting that Transaction is a number:
			- x1 digit whole-number part -> [1-5]
			- x4 digits decimal part 
			--> [1-5].xxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '0',
		});
	});
});
