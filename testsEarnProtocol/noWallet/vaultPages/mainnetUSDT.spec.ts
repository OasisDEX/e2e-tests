import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe.only('Vault page - Mainnet USDT', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 60_000);

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

	test('It should show "How it works" page', async ({ app }) => {
		await app.vaultPage.howItAllWorks();

		await app.vaultPage.howItWorks.shouldHaveHeader('How it all works', {
			timeout: expectDefaultTimeout * 2,
		});
		await app.vaultPage.howItWorks.shouldLinkToLitePaper();
		await app.vaultPage.howItWorks.shouldHaveTabActive('Rebalance mechanism');
		await app.vaultPage.howItWorks.shouldHaveImage('how-it-works');

		await app.vaultPage.howItWorks.selectTab('Governance');
		await app.vaultPage.howItWorks.shouldHaveTabActive('Governance');
		await app.vaultPage.howItWorks.shouldHaveImage('governance');

		await app.vaultPage.howItWorks.shouldHaveHeader('Lower Risk Historical Yields', {
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.howItWorks.shouldHaveHeader('Security');
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeGreaterThan(99);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});

	test('It should not have duplicated strategy names', async ({ app }) => {
		await app.vaultPage.exposure.shouldNotHaveDuplicatedStrategyNames();
	});

	test('It should not have 0.00% APY for any arks', async ({ app }) => {
		await app.vaultPage.exposure.shouldNotHaveStrategyApysEqualToZero();
	});
});
