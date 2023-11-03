import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Earn Ethereum', async () => {
	test('It should allow to simulate an Aave V3 Ethereum Earn position before opening it - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11388',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '50.00', token: 'ETH' });
		await app.position.overview.shouldHavePrev30daysNetValue({
			token: 'ETH',
			amount: '50.[0-9]{2}',
		});
		await app.position.setup.shouldHaveCurrentPrice({
			amount: '[1-9].[0-9]{2,4}',
			pair: 'WSTETH/ETH',
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[1-9].[0-9]{3,4}',
			pair: 'WSTETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[1-9][0-9]{2}.[0-9]{5}',
			token: 'WSTETH',
			dollarsAmount: '[1-9][0-9]{2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '1.[0-9]{4}',
			percentage: '0.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveMultiply({
			current: '1',
			future: '[1-9](.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt({
			token: 'ETH',
			current: '0.00000',
			future: '[1-9][0-9]{2}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'WSTETH',
			current: '0.00000',
			future: '[1-9][0-9]{2}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should allow to simulate an Aave V3 Ethereum Earn position before opening it - Adjust risk - Up and Down  - No wallet connected @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12600',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/sdaiusdc#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'SDAI', amount: '15000' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]([0-9]{2,3})? USDC',
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
			amount: '0.[0-9]([0-9]{2,3})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
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
			amount: '0.[0-9]([0-9]{2,3})? USDC',
		});

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{2}');
		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue();
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11620',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	test('It should validate risk slider - Safe @regression', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11623',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		// It takes some time for the slider to be editable
		await app.position.setup.waitForSliderToBeEditable();
		await app.position.setup.moveSlider({ value: 0.5 });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, the price of WSTETH needs to move over ',
			'% with respect to ETH for this position to be available for liquidation.',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});

	test('It should validate risk slider - Risky @regression', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11624',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '5' });
		await app.position.setup.shouldHaveWarning(
			'At the chosen risk level, if the price of WSTETH moves over ',
			'%  with respect to ETH this Earn position could be liquidated. ',
			"Aave's liquidations penalty is at least ",
			'%.'
		);
	});
});
