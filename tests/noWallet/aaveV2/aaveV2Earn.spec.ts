import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v2 Earn', async () => {
	test('It should allow to simulate an Aave V2 Earn position before opening it - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12577',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v2/earn/stETHeth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '33.12345' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '33.12', token: 'ETH' });
		await app.position.overview.shouldHavePrev30daysNetValue({
			token: 'ETH',
			amount: '33.[0-9]{2}',
		});
		await app.position.setup.shouldHaveCurrentPrice({
			amount: '[0-9](.[0-9]{2,4})?',
			pair: 'STETH/ETH',
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-3].[0-9]{3,4}',
			pair: 'STETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-9]{2,3}.[0-9]{5}',
			token: 'STETH',
			dollarsAmount: '[0-9]{2,3},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveFlashloanAmount({
			token: 'DAI',
			amount: '[0-9]{2,3},[0-9]{3}.[0-9]{4}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[0-9].[0-9]{4}',
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
			future: '[0-9]{2,3}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveTotalCollateral({
			token: 'STETH',
			current: '0.00000',
			future: '[0-9]{2,3}.[0-9]{5}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveTransactionFee({ fee: '0' });
	});

	test('It should allow to simulate an Aave V2 Earn position before opening it - Adjust risk - Down and Up  - No wallet connected', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12601',
		});

		test.setTimeout(longTestTimeout);

		await app.page.goto('/ethereum/aave/v2/earn/stETHeth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.setup.waitForComponentToBeStable();
		await app.position.setup.deposit({ token: 'ETH', amount: '19' });

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]([0-9]{2,3})? STETH/ETH',
		});
		const initialLiqPrice = await app.position.manage.getLiquidationPrice();

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]([0-9]{2,3})? STETH/ETH',
		});

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);

		// RISK UP
		await app.position.setup.moveSlider({ value: 0.8 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '...',
			exactAmount: true,
		});
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '0.[0-9]([0-9]{2,3})? STETH/ETH',
		});

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		expect(updatedLiqPrice2).toBeGreaterThan(updatedLiqPrice);
	});
});
