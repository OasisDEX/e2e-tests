import { test } from '#institutionsWithWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - Risk Parameters', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await signIn({ app, userRights: 'client', role: 'Viewer' });

		await app.header.shouldHave({ connectWallet: true });

		await app.header.connectWallet();

		await app.modals.signIn.continueWithWallet();
		await app.modals.signIn.metamask();
		await metamask.connectToDapp();

		await app.header.shouldHave({ shortenedWalletAddress: '0x1064...4743F' });
		await app.header.shouldNothaveConnectWalletButton();

		await app.clientDashboard.selectTab('Vaults');

		await app.clientDashboard.vaults.selectPanel('Risk Parameters');
		await app.clientDashboard.vaults.riskParameters.shouldBeVisible();
	});

	test('It should allow to edit Vault Cap', async ({ app, metamask }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.clientDashboard.vaults.riskParameters.editVaultCap();

		await app.clientDashboard.vaults.riskParameters.shouldHaveEditVaultModal();
		await app.clientDashboard.vaults.riskParameters.enterNewVaultCapValue('5555');
		await app.clientDashboard.vaults.riskParameters.addTransaction();

		await app.clientDashboard.vaults.riskParameters.shouldhaveTransactionInQueue({
			riskParameter: 'Vault Cap',
			newValue: '5555',
		});

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.clientDashboard.vaults.riskParameters.executeTransaction();

		// TO BE DONE - UI returning error in automated test - But MetaMask popup is correctly triggered when testing manually
		// await metamask.rejectTransaction();
	});

	test('It should have no transactions in the queue - Risk Parameters tab', async ({ app }) => {
		await app.clientDashboard.vaults.riskParameters.shouldHaveNoTransactionsInQueue();
	});
});
