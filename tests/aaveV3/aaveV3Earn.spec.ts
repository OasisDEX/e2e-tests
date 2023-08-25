import { test } from '#fixtures';

test.describe('Aave v3 Earn', async () => {
	test('It should allow to simulate a position before openiing it @regression', async ({
		browserName,
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description:
				'https://app.shortcut.com/oazo-apps/story/11388/tc-aave-v3-earn-should-allow-to-simulate-a-position-before-opening-it',
		});

		await app.page.goto('/ethereum/aave/v3/earn/wstetheth#simulate');

		// Depositing collateral too quickly after loading page returns wrong simulation results
		if (['firefox', 'webkit'].includes(browserName)) {
			await app.page.waitForTimeout(3000);
		} else {
			await app.page.waitForTimeout(1500);
		}

		await app.position.setup.deposit('50');

		await app.position.overview.shouldHaveTokenAmount({ amount: '50.00', token: 'ETH' });
		await app.position.overview.shouldHavePrev30daysNetValue('50.');

		await app.position.setup.shouldHaveCurrentPrice();
		await app.position.setup.shouldHaveLiquidationPrice();

		await app.position.setup.orderInformation.shouldHaveBuyingAmount('WSTETH');
		await app.position.setup.orderInformation.shouldHavePriceImpact();
		await app.position.setup.orderInformation.shouldHaveSlippageLimit();
		await app.position.setup.orderInformation.shouldHaveMultiply();
		await app.position.setup.orderInformation.shouldHaveOutstandingDebt('ETH');
		await app.position.setup.orderInformation.shouldHaveTotalCollateral('WSTETH');
		await app.position.setup.orderInformation.shouldHaveLTV();
		await app.position.setup.orderInformation.shouldHaveTransactionFee();
	});
});
