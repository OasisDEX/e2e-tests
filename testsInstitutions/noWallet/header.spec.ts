import { test } from '#institutionsNoWalletFixtures';
import { adminUsername, clientUsername, signIn } from 'srcInstitutions/utils/signIn';

test.describe('Header - Client - No wallet', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
	});

	test(`It should display 'Log out' button, user's email address and 'Connect wallet' button in header`, async ({
		app,
	}) => {
		await app.header.shouldHave({
			logOut: true,
			emailAddress: clientUsername,
			connectWallet: true,
		});
	});
});

test.describe('Header - Admin - No wallet', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'admin' });
	});

	test(`It should display 'Log out' button, user's email address and 'Connect wallet' button in header`, async ({
		app,
	}) => {
		await app.header.shouldHave({
			logOut: true,
			emailAddress: adminUsername,
			connectWallet: true,
		});
	});
});
