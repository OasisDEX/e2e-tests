import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Earn Ethereum', async () => {
	test('It should allow to simulate a position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11388',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '50.00', token: 'ETH' });
		await app.position.overview.shouldHavePrev30daysNetValue({ token: 'ETH', wholePart: '50' });

		/* Asserting that Current price is a number:
			- x1 digit whole-number part
			- x4 digits decimal part 
			--> x.xxxx
		*/
		await app.position.setup.shouldHaveCurrentPrice({
			amount: '[1-9].[0-9]{2,4}',
			pair: 'WSTETH/ETH',
		});
		/* Asserting that Liquidation price is a number:
			- x1 digit whole-number part
			- x4 digits decimal part 
			--> x.xxxx
		*/
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9].[0-9]{3,4}',
			pair: 'WSTETH/ETH',
		});

		/* Asserting that Buying amount in token value is a number:
			- x3 digits whole-number part
			- x5 digits decimal part 
			--> xxx.xxxxx
			Asserting that Buying amount in $ is a number:
			- x6 digit whole-number part
			- x2 digits decimal part 
			--> xxx,xxx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-9][0-9]{2}.[0-9]{5}',
			token: 'WSTETH',
			dollarsAmount: '[1-9][0-9]{2},[0-9]{3}.[0-9]{2}',
		});
		/* Asserting that Price impact amount is a number:
			- x1 digit whole-number part -> '1'
			- x4 digits decimal part 
			--> 1.xxxx
			Asserting that Price impact percentage is a number:
			- x1 digit whole-number part -> '0'
			- x2 digits decimal part 
			--> 0.xx
		*/
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '1.[0-9]{4}',
			percentage: '0.[0-9]{2}',
		});
		/* Asserting that Slipage limit percentage is a number:
			- x1 digit whole-number part -> '0'
			- x2 digits decimal part 
			--> 0.xx
		*/
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		/* Asserting that Multiply future value is a number:
			- x1 digit whole-number part
			- none or x1 digit decimal part 
			--> x or x.x
		*/
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-9](.[0-9]{1,2})?',
		});
		/* Asserting that Outstanding Debt future value is a number:
			- x3 digits whole-number part
			- x5 digits decimal part 
			--> xxx.xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'ETH',
			current: '0.00000',
			future: '[1-9][0-9]{2}.[0-9]{5}',
		});
		/* Asserting that Total collateral future value is a number:
			- x3 digits whole-number part
			- x5 digits decimal part 
			--> xxx.xxxxx
		*/
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WSTETH',
			current: '0.00000',
			future: '[1-9][0-9]{2}.[0-9]{5}',
		});
		/* Asserting that LTV future value is a number:
			- x2 digit2 whole-number part
			- x2 digits decimal part 
			--> xx.xx
		*/
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11620',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	test('It should validate risk slider - Safe', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11623',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		// It takes some time for the slider to be editable
		await app.position.setup.waitForSliderToBeEditable();
		await app.position.setup.moveSlider(0.5);
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, the price of WSTETH needs to move over ',
			'% with respect to ETH for this position to be available for liquidation.',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});

	test('It should validate risk slider - Risky', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11624',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, if the price of WSTETH moves over ',
			'%  with respect to ETH this Earn position could be liquidated. ',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});
});
