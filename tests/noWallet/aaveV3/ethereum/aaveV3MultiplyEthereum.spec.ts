import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Multiply Ethereum', async () => {
	// To be moved to WITH-WALLET tests
	test.skip('It should validate "Deposit <collateral>" field - No enough collateral in wallet @regression', async ({
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

	// To be moved to WITH-WALLET tests
	test.skip('It should validate risk slider - Safe @regression', async ({ app }) => {
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

	// To be moved to WITH-WALLET tests
	test.skip('It should validate risk slider - Risky @regression', async ({ app }) => {
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

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		await app.position.shouldHaveHeader('ETH/USDC Multiply #1218');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([1-3],)?[0-9]{3}.[0-9]{2}',
			token: 'ETH/USDC',
		});
		await app.position.overview.shouldHaveLoanToValue('[1-8][0-9].[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '\\$[0-9]{1,2}.[0-9]{2}' });
		await app.position.overview.shouldHaveBuyingPower('\\$[0-9]{2,3}.[0-9]{2}');
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
			amount: '([1-3],)?[0-9]{2,3}.[0-9]{2}',
			pair: 'ETH/USDC',
		});
		await app.position.setup.shouldHaveLoanToValue('[0-9]{1,2}.[0-9]{1,2}');
	});

	test('It should show position automation - Stop-Loss @regression', async ({ app }) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/RETH-DAI/1276#overview');

		await app.position.shouldHaveTab('Protection ON');
		await app.position.openTab('Protection');
		await app.position.protection.shouldHaveAutomationOn('Stop-Loss');
	});
});
