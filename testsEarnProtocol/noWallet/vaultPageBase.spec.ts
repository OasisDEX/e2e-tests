import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Base - Specific user page', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.page.goto(
			'/earn/base/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeCloseTo(100, 1);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});

	test('It should show Earned, Net Contribution and 30d APY info', async ({ app }) => {
		await app.vaultPage.shouldHaveEarned({
			token: 'USDC',
			totalAmount: '[0-9]{2,3}.[0-9]{2}',
			earnedAmount: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.vaultPage.shouldHaveNetContribution({
			token: 'USDC',
			amount: '[0-9]{2}.[0-9]{2}',
			numberOfDeposits: '[0-9]{2,3}',
		});

		await app.vaultPage.shouldHave30dApy({
			thirtyDayApy: '[0-9]{1,2}.[0-9]{2}',
			currentApy: '[0-9]{1,2}.[0-9]{2}',
		});
	});
});
