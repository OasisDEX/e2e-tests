import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Ethereum', async () => {
	test('It should allow to simulate an Aave V3 Ethereum Multiply position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11528',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/wbtcusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'WBTC', amount: '2.5' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-4][0-9].[0-9]{2}%');

		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2,3},[0-9]{3}(.[0-9]{1,2})?',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[2-5].[0-9]{4}',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-5][0-9],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBorrowRateAfterPill('[0-9].[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})? USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-4][0-9].[0-9]');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-1].[0-9]{5}',
			token: 'WBTC',
			dollarsAmount: '[1-4][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-5][0-9],[0-9]{3}.[0-9]{2}',
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
			future: '[1-4][0-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WBTC',
			current: '0.00000',
			future: '[2-3].[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({
			fee: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDC',
		});
	});

	test('It should allow to simulate an Aave V3 Ethereum Multiply position before opening it - Adjust risk - Up and Down - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12595',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/daiwbtc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'DAI', amount: '20000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{3},[0-9]{3}.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3},[0-9]{3}(.[0-9]{1,2})? DAI',
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
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})? DAI',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.1 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3},[0-9]{3}(.[0-9]{1,2})? DAI',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-9]{2},[0-9]{3}.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeGreaterThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11614',
		});

		await app.page.goto('/ethereum/aave/v3/multiply/rethusdc#simulate');
		await app.position.setup.deposit({ token: 'RETH', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	test('It should validate risk slider - Safe @regression', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11615',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ethdai#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, the price of ETH needs to move over ',
			'% with respect to DAI for this position to be available for liquidation.',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});

	test('It should validate risk slider - Risky @regression', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11616',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/multiply/ethdai#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		// It takes some time for the slider to be editable
		await app.position.setup.waitForSliderToBeEditable();
		await app.position.setup.moveSlider({ value: 0.9 });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, if the price of ETH moves over ',
			'%  with respect to DAI this Multiply position could be liquidated. ',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});

	test('It should open an existing Aave V3 Multiply Ethereum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11995',
		});

		await app.page.goto('/ethereum/aave/v3/1218#overview');

		await app.position.shouldHaveHeader('Aave ETH/USDC');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([1-3],)?[0-9]{3}.[0-9]{2}',
			token: 'ETH/USDC',
		});
		await app.position.overview.shouldHaveLoanToValue('[2-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{1,2}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerGreaterThanZero();
		await app.position.overview.shouldHaveExposure({
			amount: '0.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveExposureGreaterThanZero('ETH');
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveBorrowRate('[0-9].[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '([0-3],)?[0-9]{3}.[0-9]{2}',
			pair: 'USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[1-9][0-9].[0-9]');
	});
});
