import { expect, test } from '#noWalletFixtures';
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
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '\\$[1-9][0-9],[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[1-4][0-9].[0-9]([0-9]{1,2})?',
			token: 'STETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}([0-9]{1,2})?',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBorrowRateAfterPill('[0-9].[0-9]{2}%');

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
			percentage: '[0-9].[0-9]{2}',
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
			future: '[1-3][0-9].[0-9]{5}',
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

	test('It should allow to simulate an Aave V2 Multiply position before opening it - Adjust risk - Up and Down  - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12599',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v2/multiply/wBTCusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WBTC', amount: '1.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9],[0-9]{3}.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9],[0-9]{3}(.[0-9]{1,2})? USDC',
		});
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue();

		// RISK UP
		await app.position.setup.moveSlider({ value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.1 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});
});
