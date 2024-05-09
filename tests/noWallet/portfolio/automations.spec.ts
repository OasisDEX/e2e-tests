import { test } from '#noWalletFixtures';

test.describe.skip('Portfolio - Automations', async () => {
	test('Portfolio - Active automation should be highlighted', async ({ app }) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });

		await app.portfolio.positionsHub.positions.byId('1143');
		//
		await app.pause();
		//
	});
});
