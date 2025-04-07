import { test } from '#noWalletFixtures';

test.describe('Aave v3 Multiply Ethereum', async () => {
	// SKIP - Stop-Loss executed - New position needed for test
	test.skip('It should show if position automation is ON - Stop-Loss @regression', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/RETH-DAI/1276#overview');

		await app.position.shouldHaveTab('Protection ON');
		await app.position.openTab('Protection');
		await app.position.protection.shouldHaveAutomationOn('Stop-Loss');
	});
});
