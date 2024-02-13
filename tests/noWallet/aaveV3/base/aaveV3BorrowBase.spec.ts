import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Base', async () => {
	test('It should allow to simulate an Aave V3 Borrow Base position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12453',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/base/aave/v3/borrow/ethusdbc');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '15' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('15.00');
		await app.position.overview.shouldHaveBorrowRateAfterPill('-[0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'USDBC',
			amount: '[1-9][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'ETH',
			current: '0.00000',
			future: '15.00000',
		});

		await app.position.setup.borrow({ token: 'USDBC', amount: '7000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-9][0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-9][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveDebtAfterPill({ amount: '7,000.00', token: 'USDBC' });
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'USDBC',
			current: '0.00',
			future: '7,000.00',
		});
		await app.position.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-6][0-9].[0-9]{2}',
		});
	});
});
