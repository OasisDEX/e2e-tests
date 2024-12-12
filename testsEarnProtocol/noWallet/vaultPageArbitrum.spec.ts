import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Arbitrum - Generic page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeCloseTo(100);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});
});
