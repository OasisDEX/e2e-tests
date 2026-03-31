import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault pages @productionOnly', async () => {
	test('It should show 30d APY - DAO USDC', async ({ app }) => {
		await app.vaultPage.open('/earn/mainnet/position/0xd77f9a9f2b0c160db3e9dc2cce370c1a740c76fc');

		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');
	});

	test('It should show 30d APY - Mainnet USDC HR', async ({ app }) => {
		await app.vaultPage.open('/earn/mainnet/position/0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06');

		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');
	});

	test('It should show 30d APY - Mainnet USDT', async ({ app }) => {
		await app.vaultPage.open('/earn/mainnet/position/0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d');

		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');
	});
});
