import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v2 Multiply', async () => {
	test('It should allow to simulate an Aave V2 Multiply position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12576',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v2/multiply/stETHusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'STETH', amount: '16.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-4][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveBorrowCostAfterPill('[0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[1-9][0-9],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[1-4][0-9].[0-9]{5}',
			token: 'STETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{4}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[1-9][0-9],[0-9]{3}(.[0-9]{1,2})?',
		});

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}(.[0-9]{1,2})? USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-9].[0-9]{5}',
			token: 'STETH',
			dollarsAmount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-3],[0-9]{3}.[0-9]{2}',
			percentage: '0.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-2](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'STETH',
			current: '0.00000',
			future: '[2-3][0-9].[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-3][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDC',
		});
	});
});
