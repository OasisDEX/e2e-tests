import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Vault page - Sonic USDC.E', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 100_00);

		await app.vaultPage.open('/earn/sonic/position/0x507a2d9e87dbd3076e65992049c41270b47964f8');

		// pause to avoid random fails
		await app.page.waitForTimeout(2_000);
	});

	test('It should show 30d APY, Live APY, Assets in vault and Deposit Cap info @regression', async ({
		app,
	}) => {
		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveAssets({
			token: 'USDC.E',
			tokenAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
			usdAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'USDC.E',
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

		await app.page.waitForTimeout(2_000);
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
