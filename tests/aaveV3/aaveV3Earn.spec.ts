import { test } from '#fixtures';

test.describe('Aave v3 Earn', async () => {
	test('It should allow to simulate a position before opening it - No wallet connected @regression', async ({
		browserName,
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description:
				'https://app.shortcut.com/oazo-apps/story/11388/tc-aave-v3-earn-should-allow-to-simulate-a-position-before-opening-it',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		if (['firefox', 'webkit'].includes(browserName)) {
			await app.page.waitForTimeout(3000);
		} else {
			await app.page.waitForTimeout(1500);
		}

		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '50.00', token: 'ETH' });
		await app.position.overview.shouldHavePrev30daysNetValue({ token: 'ETH', wholePart: '50' });

		/* Asserting that Current price is a number:
			- x1 digit whole-number part
			- x4 digits decimal part 
			--> x.xxxx
		*/
		await app.position.setup.shouldHaveCurrentPrice({
			amount: '[1-9].[0-9]{4}',
			pair: 'WSTETH/ETH',
		});
		/* Asserting that Liquidation price is a number:
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> x.xxxx
		*/
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9].[0-9]{2}',
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
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]\\d');
		/* Asserting that Multiply future value is a number:
			- x1 digit whole-number part
			- none or x1 digit decimal part 
			--> x or x.x
		*/
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-9](.[0-9])?',
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
		await app.position.setup.orderInformation.shouldHaveTransactionFee('0 + (n/a)');
	});
});
