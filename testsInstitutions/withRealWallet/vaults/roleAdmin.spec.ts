import { test } from '#institutionsWithWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - Role Admin', async () => {
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

		await app.clientDashboard.vaults.selectPanel('Role admin');
		await app.clientDashboard.vaults.roleAdmin.shouldBeVisible();
	});

	test(`It should fail to Revoke address' role -- With non governor wallet`, async ({ app }) => {
		await app.clientDashboard.vaults.roleAdmin.removeRole(
			'0x10649c79428d718621821Cf6299e91920284743F',
		);
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
			action: 'Revoke',
			role: 'Keeper',
			address: '0x10649c79428d718621821Cf6299e91920284743F',
		});

		await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxError();
	});

	test('It should fail to Add a role to an address -- With non governor wallet', async ({
		app,
	}) => {
		await app.clientDashboard.vaults.roleAdmin.addNewRole.fillAddress(
			'0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
		);
		await app.clientDashboard.vaults.roleAdmin.addNewRole.selectRole('Commander');
		await app.clientDashboard.vaults.roleAdmin.addNewRole.addRole();

		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
			action: 'Grant',
			role: 'Commander',
			address: '0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
		});

		await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxError();
	});

	test('It should remove tx from queue', async ({ app }) => {
		await app.clientDashboard.vaults.roleAdmin.removeRole(
			'0x10649c79428d718621821Cf6299e91920284743F',
		);
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
			action: 'Revoke',
			role: 'Keeper',
			address: '0x10649c79428d718621821Cf6299e91920284743F',
		});

		await app.clientDashboard.vaults.roleAdmin.removeTxFromQueue({
			action: 'Revoke',
			role: 'Keeper',
			address: '0x10649c79428d718621821Cf6299e91920284743F',
		});

		await app.clientDashboard.vaults.roleAdmin.shouldHaveNoTransactionsInQueue();
	});
});
