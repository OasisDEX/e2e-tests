import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Aave v3 Borrow Ethereum', async () => {
	// To be moved to WITH-WALLET tests
	test.skip('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11613',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/wbtcusdc#simulate');
		await app.position.setup.deposit({ token: 'WBTC', amount: '5' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet'
		);
	});

	// To be moved to WITH-WALLET tests
	test.skip('It should validate "Borrow <quote>" field - Over maximum borrowing amount @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11625',
		});

		await app.page.goto('/ethereum/aave/v3/borrow/ethusdc#simulate');
		await app.position.setup.borrow({ token: 'USDC', amount: '50' });
		await app.position.setup.shouldHaveError('You cannot borrow more than 0.00 USDC');
	});
});
