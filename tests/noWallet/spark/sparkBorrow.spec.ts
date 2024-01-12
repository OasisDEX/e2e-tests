import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Spark Borrow', async () => {
	test('It should allow to simulate an Spark Borrow position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12583',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/borrow/wstethdai#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '19.12345' });

		await app.position.overview.shouldHaveNetValueAfterPill('19.12');
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '19.12345',
			token: 'WSTETH',
		});
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'DAI',
			amount: '[1-6][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WSTETH',
			current: '0.00000',
			future: '19.12345',
		});

		await app.position.setup.borrow({ token: 'DAI', amount: '20,000.1234' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('1,[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-9][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveBorrowCostAfterPill('[1-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('1[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '20,000.1234', token: 'DAI' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'DAI',
			current: '0.00',
			future: '20,000.1234',
		});
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});
});
