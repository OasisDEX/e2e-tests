import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Arbitrum', async () => {
	test('It should allow to simulate an Aave V3 Borrow Arbitrum position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12331',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/borrow/ethusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '30' });

		await app.position.overview.shouldHaveBorrowCostAfterPill('-[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('[2-3][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({ amount: '30.00000', token: 'ETH' });
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDC',
			amount: '[1-9][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'ETH',
			current: '0.00000',
			future: '30.00000',
		});

		await app.position.setup.borrow({ token: 'USDC', amount: '8000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-6][0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[1-2][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '8,000.0000', token: 'USDC' });
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDC',
			current: '0.00',
			future: '8,000.00',
		});
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});
	});
});
