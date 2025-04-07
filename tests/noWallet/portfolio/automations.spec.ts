import { test } from '#noWalletFixtures';

test.describe('Portfolio - Automations', async () => {
	test('Portfolio - Should show current status of the position automations - Stop-Loss - Aave V3 Borrow - Ethereum @regression', async ({
		app,
	}) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });

		await app.portfolio.positionsHub.positions.byId('1143').shouldHaveAutomations([
			{ automation: 'Stop-Loss', status: 'On' },
			{ automation: 'Auto Sell', status: 'Off' },
			{ automation: 'Auto Buy', status: 'Off' },
			{ automation: 'Take Profit', status: 'Off' },
		]);
	});

	// SKIP - Stop-Loss executed - New position needed for test
	test.skip('Portfolio - Should show current status of the position automations - Stop-Loss - Aave V3 Multiply - Ethereum @regression', async ({
		app,
	}) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });

		await app.portfolio.positionsHub.positions.byId('1276').shouldHaveAutomations([
			{ automation: 'Stop-Loss', status: 'On' },
			{ automation: 'Auto Sell', status: 'Off' },
			{ automation: 'Auto Buy', status: 'Off' },
			{ automation: 'Take Profit', status: 'Off' },
		]);
	});

	test('Portfolio - Should show current status of the position automations - Stop-Loss & Auto Take Profit - Aave V3 - Ethereum @regression', async ({
		app,
	}) => {
		await app.portfolio.open('0xbEf4befb4F230F43905313077e3824d7386E09F8', { withPositions: true });

		await app.portfolio.positionsHub.positions.byId('1586').shouldHaveAutomations([
			{ automation: 'Stop-Loss', status: 'On' },
			{ automation: 'Auto Sell', status: 'Off' },
			{ automation: 'Auto Buy', status: 'Off' },
			{ automation: 'Take Profit', status: 'On' },
		]);
	});

	test('Portfolio - Should show current status of the position automations - Trailing Stop-Loss, Auto-Sell & Auto-Buy - Aave V3 - Optimism @regression', async ({
		app,
	}) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });

		await app.portfolio.positionsHub.positions.byId('19').shouldHaveAutomations([
			{ automation: 'Stop-Loss', status: 'On' },
			{ automation: 'Auto Sell', status: 'On' },
			{ automation: 'Auto Buy', status: 'On' },
			{ automation: 'Take Profit', status: 'Off' },
		]);
	});
});
