import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Spark Multiply', async () => {
	test('It should allow to simulate a Spark Multiply position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12582',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/spark/v3/multiply/sdaieth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'SDAI', amount: '21,000.1234' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-4][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveBorrowCostAfterPill('[0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[1-9][0-9],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[1-4][0-9],[0-9]{3}.[0-9]{4}',
			token: 'SDAI',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[0-8].[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[1-2][0-9],[0-9]{3}(.[0-9]{1,2})?',
		});

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9],[0-9]{3}(.[0-9]{1,2})? SDAI',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-9],[0-9]{3}.[0-9]{4}',
			token: 'SDAI',
			dollarsAmount: '[1-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveFlashloanAmount({
			token: 'ETH',
			amount: '[0-9].[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-3],[0-9]{3}.[0-9]{2}',
			percentage: '[0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'ETH',
			current: '0.00000',
			future: '[1-6].[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'SDAI',
			current: '0.0000',
			future: '[0-9]{2},[0-9]{3}.[0-9]{4}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-3][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '0.[0-9]{5}',
			token: 'ETH',
		});
	});
});
