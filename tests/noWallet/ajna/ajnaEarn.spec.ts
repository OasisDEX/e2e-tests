import { test } from '#noWalletFixtures';

test.describe('Ajna Earn', async () => {
	test.skip('It should allow to simulate an Ajna Earn position before opening it - No wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'issue',
			description: '11379',
		});

		await app.page.goto('/ethereum/ajna/earn/CBETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '9.12345' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '9.1234', token: 'ETH' });
		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.0[0-9]{3}',
		});

		/* Asserting that current Amount to lend in token value is 0.00 ETH
		    Asserting that future Amount to lend in token value is a number:
			- x1 or x2 digits whole-number part
			- x4 digits decimal part 
			--> x.xxxx ETH or xx.xxxx ETH
		*/
		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{4}',
			token: 'ETH',
		});
		/* Asserting that current Net APY value is 0.00%
		    Asserting that future Net APY value is a percentage:
			- x1 digit whole-number part
			- x2 digits decimal part 
			--> x.xx%
		*/
		await app.position.setup.orderInformation.shouldHaveNetAPY({
			current: '0.00',
			future: '[0-5].[0-9]{2}',
		});
		/* Asserting that current LendingPrice in tokens pair value is 0.00 CBETH/ETH
		    Asserting that future LendingPrice in tokens pair value is a number:
			- x1 digit whole-number part
			- x4 digits decimal part 
			--> x.xxxx CBETH/ETH
		*/
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-5].[0-9]{4}',
			tokensPair: 'CBETH/ETH',
		});
		/* Asserting that current Max LTV value is 0.00%
		    Asserting that future Max LTV value is a percentage:
			- x2 digits whole-number part
			- x2 digits decimal part 
			--> xx.xx%
		*/
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[1-9]{2}.[0-9]{2}',
		});
	});
});
