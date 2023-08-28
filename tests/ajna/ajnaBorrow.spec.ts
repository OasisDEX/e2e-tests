import { test } from '#fixtures';

test.describe('Ajna Borrow', async () => {
	test.skip('It should simulate creating an ajna Borrow position', async ({ app }) => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: 'xxx',
			},
			{
				type: 'Issue',
				description: '11379',
			}
		);

		await app.page.goto('/ethereum/ajna/earn/CBETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		// await app.position.setup.deposit('50');

		// TODO
		// await app.pause();
	});

	test('It should validate "Deposit <collateral>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11542',
		});

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '50' });
		await app.position.setup.shouldHaveError(
			'You cannot deposit more collateral than the amount in your wallet.'
		);
	});

	test.skip('It should validate "Borrow <quote>" field - No enough collateral in wallet', async ({
		app,
	}) => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '11542',
			},
			{
				type: 'Issue',
				description: '11548',
			}
		);

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.borrow({ token: 'ETH', amount: '0.1' });
		await app.position.setup.shouldHaveError(
			'xxx' // TODO
		);

		await app.pause();
	});
});
