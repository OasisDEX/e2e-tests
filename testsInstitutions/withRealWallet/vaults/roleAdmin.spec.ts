import { test } from '#institutionsWithWalletFixtures';
import { connectWallet } from 'srcInstitutions/utils/connectWallet';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - Role Admin', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await signIn({ app, userRights: 'client', role: 'Viewer' });

		await app.header.shouldHave({ connectWallet: true });

		await connectWallet({ app, metamask });

		await app.clientDashboard.selectTab('Vaults');

		await app.clientDashboard.vaults.selectPanel('Role admin');
		await app.clientDashboard.vaults.roleAdmin.shouldBeVisible();
	});

	test(`It should fail to Revoke address' role -- With non governor wallet`, async ({
		app,
		metamask,
	}) => {
		await app.clientDashboard.vaults.roleAdmin.removeRole(
			'0x10649c79428d718621821Cf6299e91920284743F',
		);
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
			action: 'Revoke',
			role: 'Keeper',
			address: '0x10649c79428d718621821Cf6299e91920284743F',
		});

		await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
		await metamask.rejectTransaction(); // PRIVY --> Behaviour changed with Privy
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxError();
	});

	test('It should fail to Add a role to an address -- With non governor wallet', async ({
		app,
		metamask,
	}) => {
		// To avoid random fails
		await app.clientDashboard.vaults.roleAdmin.shouldHaveRole({
			role: 'Keeper',
			address: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
		});

		await app.clientDashboard.vaults.roleAdmin.addNewRole.fillAddress(
			'0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
		);
		await app.clientDashboard.vaults.roleAdmin.addNewRole.selectRole('Keeper');
		await app.clientDashboard.vaults.roleAdmin.addNewRole.addRole();
		await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
			action: 'Grant',
			role: 'Keeper',
			address: '0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
		});

		await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
		await metamask.rejectTransaction(); // PRIVY --> Behaviour changed with Privy
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
