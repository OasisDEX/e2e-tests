import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Optimism', async () => {
	test('It should allow to simulate an Aave V3 Optimism Borrow position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12579',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/optimism/aave/v3/borrow/usdcwbtc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'USDC', amount: '18,000.12' });

		await app.position.overview.shouldHaveBorrowCostAfterPill('-[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({ amount: '18,000.12', token: 'USDC' });
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'WBTC',
			amount: '0.[0-9]{4}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'USDC',
			current: '0.00',
			future: '18,000.12',
		});

		await app.position.setup.borrow({ token: 'WBTC', amount: '0.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-5][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '0.1234', token: 'WBTC' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'WBTC',
			current: '0.00',
			future: '0.12345',
		});
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-5][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should open existent Aave V3 Borrow Optimism vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11994',
		});

		await app.page.goto('/optimism/aave/v3/4');

		await app.position.shouldHaveHeader('Aave DAI/WBTC');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[1-8][0-9],[0-9]{3}.[0-9]{2}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveLoanToValue('[3-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveBorrowCost('-[1-9]?[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '0.[1-9][0-9]', token: 'DAI' });
		await app.position.overview.shouldHaveExposure({
			amount: '[1-2].[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '0.0000',
			token: 'WBTC',
		});
	});
});
