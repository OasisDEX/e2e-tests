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
		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveNetAPY({
			current: '0.00',
			future: '[0-5].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-5].[0-9]{4}',
			tokensPair: 'CBETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{2}.[0-9]{2}',
		});
	});
});
