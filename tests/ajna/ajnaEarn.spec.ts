import { test } from '#fixtures';

test.describe('Ajna Earn', async () => {
	test.skip('It should simulate creating an ajna Earn position', async ({ app }) => {
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
});
