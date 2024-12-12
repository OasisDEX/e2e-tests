import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Base - Generic page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.page.goto('/earn/base/position/usdc-ya-later');
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeCloseTo(100);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});
});

test.describe.only('Vault page - Base - Specific user page', async () => {
	test.beforeEach(async ({ app }) => {
		await app.page.goto(
			'/earn/base/position/usdc-ya-later/0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA'
		);
	});

	test('It should show Earned, Net Contribution and 30d APY info', async ({ app }) => {
		await app.vaultPage.shouldHaveEarned({
			token: 'USDC',
			tokenAmount: '[0-9]{2}.[0-9]{2}',
			usdAmount: '[0-9]{2}.[0-9]{2}',
		});

		await app.vaultPage.shouldHaveNetContribution({
			usdAmount: '[0-9]{2}.[0-9]{2}',
			numberOfDeposits: '[0-9]',
		});

		await app.vaultPage.shouldHave30dApy({
			thirtyDayApy: '[0-9]{1,2}.[0-9]{2}',
			currentApy: '[0-9]{1,2}.[0-9]{2}',
		});
	});
});
