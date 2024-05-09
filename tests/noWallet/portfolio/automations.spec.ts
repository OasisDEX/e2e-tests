import { test } from '#noWalletFixtures';

test.describe('Portfolio - Automations', async () => {
	test('Portfolio - Should show current status of the position automations @regression', async ({
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
});
