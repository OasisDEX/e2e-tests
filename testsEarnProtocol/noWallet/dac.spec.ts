import { test } from '#earnProtocolFixtures';

test.describe('DCA Strategy', async () => {
	test.beforeEach(async ({ app }) => {
		await app.dca.openPage();
	});

	test('It should select network', async ({ app }) => {
		// 'Ethereum' selected by default
		await app.dca.shouldHaveNetworkSelected('Ethereum');

		// Select 'Base'
		await app.dca.selectNetwork('Base');
		await app.dca.shouldHaveNetworkSelected('Base');

		// Select 'Ethereum'
		await app.dca.selectNetwork('Ethereum');
		await app.dca.shouldHaveNetworkSelected('Ethereum');
	});
});
