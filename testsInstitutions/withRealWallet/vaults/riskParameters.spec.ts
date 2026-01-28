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

	test('It should have no transactions in the queue - Risk Parameters tab', async ({ app }) => {
		await app.clientDashboard.vaults.riskParameters.shouldHaveNoTransactionsInQueue();
	});
});
