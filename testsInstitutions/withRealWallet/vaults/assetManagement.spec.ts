import { test } from '#institutionsWithWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('With wallet - Vaults - Asset Management', async () => {
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

		await app.clientDashboard.vaults.selectPanel('Asset management');
		await app.clientDashboard.vaults.assetManagement.shouldBeVisible();
	});

	test('It should show Vault balance and wallet deposits', async ({ app }) => {
		await app.clientDashboard.vaults.assetManagement.shouldHave({
			vaultAssetsBalance: '[0-9]{1,3}.[0-9]{2,4}([MK])?',
			walletDeposits: '[0-9]{1,3}.[0-9]{2,4}',
			depositBalance: '[0-9]{1,3}.[0-9]{2,4}',
			withdrawalBalance: '[0-9]{1,3}.[0-9]{2,4}',
		});
	});

	test('It should deposit - until rejecting tx', async ({ app, metamask }) => {
		// Wait for component to fully load
		await app.clientDashboard.vaults.assetManagement.shouldHave({
			depositBalance: '[0-9]{1,3}.[0-9]{2,4}',
		});

		await app.clientDashboard.vaults.assetManagement.enterDepositAmount('0.2');
		await app.clientDashboard.vaults.assetManagement.addDepositTransaction();

		await app.clientDashboard.vaults.assetManagement.shouldHaveTransactionsInQueue([
			{ action: 'Approve', amount: '0.2000', token: 'USDC' },
			{
				action: 'Deposit',
				amount: '0.2000',
				token: 'USDC',
				fromAddress: '0x10649c79428d718621821Cf6299e91920284743F',
			},
		]);

		await app.clientDashboard.vaults.assetManagement.executeTx({
			action: 'Approve',
			amount: '0.2000',
			token: 'USDC',
		});
		await metamask.rejectTransaction();
		// Error displayed after rejecting tx
		await app.clientDashboard.vaults.assetManagement.shouldHaveTxError({
			action: 'Approve',
			amount: '0.2000',
			token: 'USDC',
		});

		await app.clientDashboard.vaults.assetManagement.executeTx({
			action: 'Deposit',
			amount: '0.2000',
			token: 'USDC',
		});
		// Error displayed since APPROVE tx was rejected and it's needed for DEPOSIT tx
		await app.clientDashboard.vaults.assetManagement.shouldHaveTxError({
			action: 'Deposit',
			amount: '0.2000',
			token: 'USDC',
		});
	});
});
