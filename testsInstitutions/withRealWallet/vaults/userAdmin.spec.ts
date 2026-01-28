import { test } from '#institutionsWithWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - User Admin', async () => {
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

		await app.clientDashboard.vaults.selectPanel('User admin');
		await app.clientDashboard.vaults.userAdmin.shouldBeVisible();
	});

	test('It should list Active users', async ({ app }) => {
		await app.clientDashboard.vaults.userAdmin.shouldHaveActiveUsers([
			{
				address: '0x6d5158f0124d9d347a7518452623d12bfb5060f4',
				tvl: '1.00K',
				firstDeposit: '18 Dec 2025',
				lastActivity: '[0-9]{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 202[5-6]',
			},
			{
				address: '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
				tvl: '[0-9]{1,3}.[0-9]{2}',
				firstDeposit: '18 Dec 2025',
				lastActivity: '[0-9]{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 202[5-6]',
			},
		]);
	});

	test('It should list Whitelisted users', async ({ app }) => {
		await app.clientDashboard.vaults.userAdmin.shouldHaveWhitelistedUsers([
			'0x10649c79428d718621821cf6299e91920284743f',
			'0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
			'0xe9c245293dac615c11a5bf26fcec91c3617645e4',
		]);
	});

	// test(`It should fail to Revoke address' role -- With non governor wallet`, async ({ app }) => {
	// 	await app.clientDashboard.vaults.roleAdmin.removeRole(
	// 		'0x10649c79428d718621821Cf6299e91920284743F',
	// 	);
	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
	// 		action: 'Revoke',
	// 		role: 'Keeper',
	// 		address: '0x10649c79428d718621821Cf6299e91920284743F',
	// 	});

	// 	await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveTxError();
	// });

	// test('It should fail to Add a role to an address -- With non governor wallet', async ({
	// 	app,
	// }) => {
	// 	await app.clientDashboard.vaults.roleAdmin.addNewRole.fillAddress(
	// 		'0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
	// 	);
	// 	await app.clientDashboard.vaults.roleAdmin.addNewRole.selectRole('Commander');
	// 	await app.clientDashboard.vaults.roleAdmin.addNewRole.addRole();

	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
	// 		action: 'Grant',
	// 		role: 'Commander',
	// 		address: '0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789',
	// 	});

	// 	await app.clientDashboard.vaults.roleAdmin.executeLatestTx();
	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveTxError();
	// });

	// test('It should remove tx from queue', async ({ app }) => {
	// 	await app.clientDashboard.vaults.roleAdmin.removeRole(
	// 		'0x10649c79428d718621821Cf6299e91920284743F',
	// 	);
	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveTxInQueue({
	// 		action: 'Revoke',
	// 		role: 'Keeper',
	// 		address: '0x10649c79428d718621821Cf6299e91920284743F',
	// 	});

	// 	await app.clientDashboard.vaults.roleAdmin.removeTxFromQueue({
	// 		action: 'Revoke',
	// 		role: 'Keeper',
	// 		address: '0x10649c79428d718621821Cf6299e91920284743F',
	// 	});

	// 	await app.clientDashboard.vaults.roleAdmin.shouldHaveNoTransactionsInQueue();
	// });
});
