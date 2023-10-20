import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Arbitrum', async () => {
	test('It should allow to simulate an Aave V3 Arbitrum Multiply position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12332',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/daiwbtc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'DAI', amount: '6000' });

		/* Asserting that Liquidation Price After pill will be:
			- x6 digits whole-number part --> 1xx,xxx.xx
			- x2 digits decimal part 
			--> [4/5/6/7/8/9],xxx.xx
		*/
		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			/1[0-9]{2}\,[0-9]{3}\.[0-9]{2}/
		);
		/* Asserting that Loan to Value After pill will be a percentage:
			- x2 digits whole-number part --> [1/2/3/4]x
			- x2 digits decimal part 
			--> [1/2/3/4]x.xx%%
		*/
		await app.position.overview.shouldHaveLoanToValueAfterPill(/[1-4][0-9]\.[0-9]{2}%/);
		/* Asserting that Borrow Cost After pill will be a percentage:
			- negative 
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> x.xx%
		*/
		await app.position.overview.shouldHaveBorrowCostAfterPill(/^-[0-9]{1,2}\.[0-9]{2}/);
		/* Asserting that Net Value After pill will be a number:
			- x4 digits whole-number part, with a ',' separator for thousands -> [2-8]x,xxx
			- x2 digits decimal part 
			--> [2-88],xxx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill(/[2-8]\,[0-9]{3}\.[0-9]{2}/);
		/* Asserting that Total Exposure After pill will be a number:
			- x4 digit whole-number part -> [1/2/3/4]
			- x4 digits decimal part 
			--> [1/2/3/4].xxxxx
		*/
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[4-9],[0-9]{3}.[0-9]{4}',
			token: 'DAI',
		});
		/* Asserting that Position Debt After pill will be a number:
			- x1 digit whole-number part -> 0
			- x4 digits decimal part 
			--> 0.xxxx
		*/
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '0.[0-9]{4}',
			token: 'WBTC',
		});
		/* Asserting that Multiple After pill will be a number:
			- x1 digit whole-number part -> 1
			- x1 digit decimal part 
			--> 1.x
		*/
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		/* Asserting that Buying Power After pill will be a number:
			- x4 digits whole-number part, with a ',' separator for thousands -> [1-7],xxx
			- 0, x1 or x2 digits decimal part 
			--> [1-7]x,xxx.xx
		*/
		await app.position.overview.shouldHaveBuyingPowerAfterPill('[1-7],[0-9]{3}(.[0-9]{1,2})?');

		/* Asserting that Liquidation price is a number:
     		- x6 digits whole-number part, with a ',' separator for thousands -> 1xx,xxx
			- x1 or x2 digits decimal part 
			--> [4/5/6/7/8],xxx.xx
		*/
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '1[0-9]{2},[0-9]{3}(.[0-9]{1,2})? DAI',
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
			tokenAmount: '1,[0-9]{3}.[0-9]{4}',
			token: 'DAI',
			dollarsAmount: '1,[0-9]{3}.[0-9]{2}',
		});
		/* Asserting that Price impact amount is a number:
			- x5 digits whole-number part, with a ',' separator for thousands -> '[1/2/3/4]x,xxx'
			- x2 digits decimal part 
			--> [1/2/3/4]x,xxx.xx
			Asserting that Price impact percentage is a number:
			- x1 digit whole-number part -> '0'
			- x2 digits decimal part 
			--> 0.xx
		*/
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-4][0-9],[0-9]{3}.[0-9]{2}',
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
			- x1 digit whole-number part -> 0
			- x5 digits decimal part 
			--> 0.xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'WBTC',
			current: '0.00',
			future: '0.[0-9]{5}',
		});
		/* Asserting that Total collateral future value is a number:
			- x4 digits whole-number part, with comma for thousands separator -> [4-9],xxx
			- x4 digits decimal part 
			--> [2/3].xxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'DAI',
			current: '0.0000',
			future: '[4-9],[0-9]{3}.[0-9]{4}',
		});
		/* Asserting that LTV future value is a number:
			- x2 digits whole-number part -> [1/2]x
			- x2 digits decimal part 
			--> [1/2]x.xx
		*/
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
		});
		/* Asserting that Transaction is a number:
			- x1 digit whole-number part -> [1-5]
			- x4 digits decimal part 
			--> [1-5].xxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[1-5].[0-9]{4}',
			token: 'DAI',
		});
	});

	test('It should open existent Aave V3 Multiply Arbitrum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11993',
		});

		await app.page.goto('/arbitrum/aave/v3/1');

		await app.position.shouldHaveHeader('Aave ETH/DAI');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[1-2],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveLoanToValue('[3-9][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCostGreaterThanZero();
		await app.position.overview.shouldHaveNetValue({ value: '[1-2].[0-9]{2}', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{5}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[3-9].[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveMultiple('[2-8].[0-9]{1,2}');
		await app.position.overview.shouldHaveBuyingPower('[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}.[0-9]{2}',
			pair: 'DAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[5-9][0-9].[0-9]');
	});
});
