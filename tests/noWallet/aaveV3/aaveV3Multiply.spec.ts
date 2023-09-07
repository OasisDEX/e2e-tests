import { test } from '#noWalletFixtures';

let actionsEnvTimeout: number;

test.describe('Aave v3 Multiply', async () => {
	test('It should allow to simulate a position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11528',
			},
			{
				type: 'Bug',
				description: '11537',
			}
		);

		await app.page.goto('/ethereum/aave/v3/multiply/wbtcusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WBTC', amount: '2.5' });

		/* Asserting that Liquidation Price After pill will be:
			- x4 digits whole-number part --> [4/5/6/7/8/9],xxx.xx
			- x2 digits decimal part 
			--> [4/5/6/7/8/9],xxx.xx
		*/
		await app.position.overview.shouldHaveLiquidationPriceAfterPill(/[4-9]\,[0-9]{3}\.[0-9]{2}/);
		/* Asserting that Loan to Value After pill will be a percentage:
			- x2 digits whole-number part --> [1/2/3/4]x
			- x2 digits decimal part 
			--> [1/2/3/4]x.xx%%
		*/
		await app.position.overview.shouldHaveLoanToValueAfterPill(/[1-4][0-9]\.[0-9]{2}%/);
		/* Asserting that Borrow Cost After pill will be a percentage:
			- positive 
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> x.xx%
		*/
		await app.position.overview.shouldHaveBorrowCostAfterPill(/^[0-9]\.[0-9]{2}/);
		/* Asserting that Net Value After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands -> [4/5/67/8]x,xxx
			- x2 digits decimal part 
			--> [4/5/6/7/8]x,xxx.xx
		*/
		await app.position.overview.shouldHaveNetValueAfterPill(/[4-8][0-9]\,[0-9]{3}\.[0-9]{2}/);
		/* Asserting that Total Exposure After pill will be a number:
			- x1 digit whole-number part -> [1/2/3/4]
			- x5 digits decimal part 
			--> [1/2/3/4].xxxxx
		*/
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[1-4].[0-9]{5}',
			token: 'WBTC',
		});
		/* Asserting that Position Debt After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands -> [1/2/3/4]x,xxx
			- x4 digits decimal part 
			--> [1/2/3/4]x,xxx.xxxx
		*/
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-4][0-9],[0-9]{3}.[0-9]{4}',
			token: 'USDC',
		});
		/* Asserting that Multiple After pill will be a number:
			- x1 digit whole-number part -> 1
			- x1 digit decimal part 
			--> 1.x
		*/
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		/* Asserting that Buying Power After pill will be a number:
			- x5 digits whole-number part, with a ',' separator for thousands -> [2/3/4/5/6]x,xxx
			- 0, x1 or x2 digits decimal part 
			--> [2/3/4/5/6]x,xxx.xx
		*/
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[2-6][0-9],[0-9]{3}(.[0-9]{1,2})? USD',
		});

		/* Asserting that Liquidation price is a number:
			- $ symbol
			- x4 digits whole-number part, with a ',' separator for thousands -> [4/5/6/7/8],xxx
			- x1 or x2 digits decimal part 
			--> [4/5/6/7/8],xxx.xx
		*/
		// Bug -> 11537 ==> Comma (thousands separator) should be added once bug is fixed
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[4-8][0-9]{3}(.[0-9]{1,2})? USDC',
		});
		/* Asserting that Liquidation price is a number:
			- x2 digits whole-number part
			- x1 digit decimal part 
			--> xx.x
		*/
		// Bug -> 11537 ==> Comma (thousands separator) should be added once bug is fixed
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');

		/* Asserting that Buying amount in token value is a number:
			- x1 digit whole-number part --> [0/1]
			- x5 digits decimal part 
			--> [0/1].xxxxx
			Asserting that Buying amount in $ is a number:
			- x5 digits whole-number part, with a ',' separator for thousands -> [1/2/3]
			- x2 digits decimal part 
			--> [1/2/3]x,xxx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-1].[0-9]{5}',
			token: 'WBTC',
			dollarsAmount: '[1-3][0-9],[0-9]{3}.[0-9]{2}',
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
			- x5 digits whole-number part, with a ',' separator for thousands -> '[1/2/3]x,xxx'
			- x2 digits decimal part 
			--> [1/2/3]x,xxx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDC',
			current: '0.00',
			future: '[1-3][0-9],[0-9]{3}.[0-9]{2}',
		});
		/* Asserting that Total collateral future value is a number:
			- x1 digit1 whole-number part -> [2/3]
			- x5 digits decimal part 
			--> [2/3].xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WBTC',
			current: '0.00000',
			future: '[2-3].[0-9]{5}',
		});
		/* Asserting that LTV future value is a number:
			- x2 digit2 whole-number part -> [1/2]x
			- x2 digits decimal part 
			--> [1/2]x.xx
		*/
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
		});
		/* Asserting that LTV future value is a number:
			- x2 digit2 whole-number part -> [2/3/4]x
			- x2 digits decimal part 
			--> [2/3/4]x.xx
		*/
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[2-4][0-9].[0-9]{2}',
			token: 'USDC',
		});
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11614',
		});

		await app.page.goto('ethereum/aave/v3/multiply/rethusdc');
		await app.position.setup.deposit({ token: 'RETH', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	test('It should validate risk slider - Safe', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11615',
		});

		await app.page.goto('ethereum/aave/v3/multiply/ethdai#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, the price of ETH needs to move over ',
			'% with respect to DAI for this position to be available for liquidation.',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});

	test('It should validate risk slider - Risky', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11616',
		});

		await app.page.goto('ethereum/aave/v3/multiply/ethdai#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		// It takes some time for the slider to be editable
		await app.position.setup.waitForSliderToBeEditable();
		await app.position.setup.moveSlider(0.9);
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, if the price of ETH moves over ',
			'%  with respect to DAI this Multiply position could be liquidated. ',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});
});
