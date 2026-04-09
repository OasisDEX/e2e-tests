import { test } from '#institutionsWithWalletFixtures';
import { connectWallet } from 'srcInstitutions/utils/connectWallet';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - Risk Parameters', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await signIn({ app, userRights: 'client', role: 'Viewer' });

		await app.header.shouldHave({ connectWallet: true });

		await connectWallet({ app, metamask });

		await app.clientDashboard.selectTab('Vaults');

		await app.clientDashboard.vaults.selectPanel('Risk Parameters');
		await app.clientDashboard.vaults.riskParameters.shouldBeVisible();
	});

	test('It should allow to edit Vault Cap - Until tx error (wallet with no role)', async ({
		app,
		metamask,
	}) => {
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
		await metamask.rejectTransaction();
		await app.clientDashboard.vaults.riskParameters.shouldHaveTxError({
			riskParameter: 'Vault Cap',
			newValue: '5555',
		});
	});

	test('It should allow to edit Buffer - Until tx error (wallet with no role)', async ({
		app,
		metamask,
	}) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.clientDashboard.vaults.riskParameters.editBuffer();

		await app.clientDashboard.vaults.riskParameters.shouldHaveEditBufferModal();
		await app.clientDashboard.vaults.riskParameters.enterNewBufferValue('77');
		await app.clientDashboard.vaults.riskParameters.addTransaction();

		await app.clientDashboard.vaults.riskParameters.shouldhaveTransactionInQueue({
			riskParameter: 'Buffer',
			newValue: '77',
		});

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.clientDashboard.vaults.riskParameters.executeTransaction();
		await metamask.rejectTransaction();
		await app.clientDashboard.vaults.riskParameters.shouldHaveTxError({
			riskParameter: 'Buffer',
			newValue: '77',
		});
	});

	test('It should have no transactions in the queue - Risk Parameters tab', async ({ app }) => {
		await app.clientDashboard.vaults.riskParameters.shouldHaveNoTransactionsInQueue();
	});
});
