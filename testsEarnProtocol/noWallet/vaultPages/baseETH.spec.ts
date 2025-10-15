import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Vault page - Base ETH', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 60_000);

		await app.vaultPage.open('/earn/base/position/0x2bb9ad69feba5547b7cd57aafe8457d40bf834af');
	});

	test('It should show 30d APY, Live APY, Assets in vault and Deposit Cap info @regression', async ({
		app,
	}) => {
		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveAssets({
			token: 'ETH',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}K',
			usdAmount: '[0-9]{1,2}.[0-9]{2}M',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'ETH',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}K',
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
