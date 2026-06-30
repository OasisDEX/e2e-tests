import { test } from '#institutionsNoWalletFixtures';
import { openInstitutionDashboard } from 'srcInstitutions/utils/openInstitutionDashboard';
import { adminUsername, clientViewerUsername, signIn } from 'srcInstitutions/utils/signIn';

test.describe('Header - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'admin' });
		await openInstitutionDashboard({ app, institution: 'Ext Demo Corp' });
	});

	test(`It should display 'Log out' button, user's email address and 'Connect wallet' button in header`, async ({
		app,
	}) => {
		await app.header.shouldHave({
			logOut: true,
			emailAddress: clientViewerUsername,
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
