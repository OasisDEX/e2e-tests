import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Mainnet USDC Higher Risk', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.vaultPage.open('/earn/mainnet/position/0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06');
	});

	test('It should show 30d APY, Live APY, Assets in vault and Deposit Cap info', async ({
		app,
	}) => {
		// await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');
		await app.vaultPage.shouldHave30dApy('New strategy');

		await app.vaultPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveAssets({
			token: 'USDC',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}M',
			usdAmount: '[0-9]{1,2}.[0-9]{2}M',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'USDC',
			tokenAmount: '[0-9]{2,3}.[0-9]{2}M',
		});
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeGreaterThan(99);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});

	test('It should not have duplicated strategy names', async ({ app }) => {
		await app.vaultPage.exposure.shouldNotHaveDuplicatedStrategyNames();
	});
});
