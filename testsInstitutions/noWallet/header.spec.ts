import { test } from '#institutionsNoWalletFixtures';
import { adminUsername, clientUsername, signIn } from 'srcInstitutions/utils/signIn';

test.describe('Header - Client', async () => {
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

	test('It should allow to set up MFA', async ({ app }) => {
		await app.header.openSettings();

		await app.modals.mfa.shouldBeVisible();
		await app.modals.mfa.shouldBeDisabled();
		await app.modals.mfa.setUpMfa();

		await app.modals.mfa.shouldHaveQrCodeAndSecret();
	});
});

test.describe('Header - Admin', async () => {
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

	test('It should allow to set up MFA', async ({ app }) => {
		await app.header.openSettings();

		await app.modals.mfa.shouldBeVisible();
		await app.modals.mfa.shouldBeDisabled();
		await app.modals.mfa.setUpMfa();

		await app.modals.mfa.shouldHaveQrCodeAndSecret();
	});
});
