import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Earn Ethereum', async () => {
	// To be moved to WITH-WALLET tests
	test.skip('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
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

	// To be moved to WITH-WALLET tests
	test.skip('It should validate risk slider - Safe', async ({ app }) => {
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

	// To be moved to WITH-WALLET tests
	test.skip('It should validate risk slider - Risky', async ({ app }) => {
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
