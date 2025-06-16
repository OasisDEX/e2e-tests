import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Mainnet USDT', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.vaultPage.open('/earn/mainnet/position/0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d');
	});

	test('It should show 30d APY, Live APY, Assets in vault and Deposit Cap info', async ({
		app,
	}) => {
		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveAssets({
			token: 'USDT',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}M',
			usdAmount: '[0-9]{1,2}.[0-9]{2}M',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'USDT',
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
