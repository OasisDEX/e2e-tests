import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Arbitrum - Generic page', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.vaultPage.open('/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17');
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeGreaterThan(99);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});
});
