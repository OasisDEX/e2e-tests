import { test } from '#institutionsFixtures';
import { clientUsername, signIn } from 'srcInstitutions/utils/signIn';

test.describe('Header - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
	});

	test.only(`It should display 'Log out' button, user's email address and 'Connect wallet' button in header`, async ({
		app,
	}) => {
		await app.header.shouldHave({
			logOut: true,
			emailAddress: clientUsername,
			connectWallet: true,
		});
	});
});
