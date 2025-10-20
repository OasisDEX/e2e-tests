import { test } from '#institutionsNoWalletFixtures';
import {
	adminMfaPassword,
	adminMfaUsername,
	adminPassword,
	adminUsername,
	clientMfaPassword,
	clientMfaUsername,
	clientPassword,
	clientUsername,
} from 'srcInstitutions/utils/signIn';

test.describe('Sign in', async () => {
	test('It should sign in with valid credentials - Admin', async ({ app }) => {
		await app.signIn.enterEmail(adminUsername);
		await app.signIn.enterPassword(adminPassword);
		await app.signIn.signIn();

		await app.adminOverview.shouldBeVisible();
	});

	test('It should askfor 2FA code - Admin', async ({ app }) => {
		await app.signIn.enterEmail(adminMfaUsername);
		await app.signIn.enterPassword(adminMfaPassword);
		await app.signIn.signIn();

		await app.signIn.shouldAskFor2fa();
	});

	test('It should show error when entering wrong 2FA code - Admin', async ({ app }) => {
		await app.signIn.enterEmail(adminMfaUsername);
		await app.signIn.enterPassword(adminMfaPassword);
		await app.signIn.signIn();

		await app.signIn.enter2faCode('000000');
		await app.signIn.verify2faCode();
		await app.signIn.shouldDisplayWrong2faCodeError();
	});

	test('It should show error when entering invalid 2FA code - Admin', async ({ app }) => {
		await app.signIn.enterEmail(adminMfaUsername);
		await app.signIn.enterPassword(adminMfaPassword);
		await app.signIn.signIn();

		await app.signIn.enter2faCode('000');
		await app.signIn.verify2faCode();
		await app.signIn.shouldDisplayInvalid2faCodeError();
	});

	test('It should sign in with valid credentials - Client', async ({ app }) => {
		await app.signIn.enterEmail(clientUsername);
		await app.signIn.enterPassword(clientPassword);
		await app.signIn.signIn();

		await app.clientDashboard.shouldBeVisible();
	});

	test('It should askfor 2FA code - Client', async ({ app }) => {
		await app.signIn.enterEmail(clientMfaUsername);
		await app.signIn.enterPassword(clientMfaPassword);
		await app.signIn.signIn();

		await app.signIn.shouldAskFor2fa();
	});

	test('It should show error when entering wrong 2FA code - Client', async ({ app }) => {
		await app.signIn.enterEmail(clientMfaUsername);
		await app.signIn.enterPassword(clientMfaPassword);
		await app.signIn.signIn();

		await app.signIn.enter2faCode('000000');
		await app.signIn.verify2faCode();
		await app.signIn.shouldDisplayWrong2faCodeError();
	});

	test('It should show error when entering invalid 2FA code - Client', async ({ app }) => {
		await app.signIn.enterEmail(clientMfaUsername);
		await app.signIn.enterPassword(clientMfaPassword);
		await app.signIn.signIn();

		await app.signIn.enter2faCode('000');
		await app.signIn.verify2faCode();
		await app.signIn.shouldDisplayInvalid2faCodeError();
	});

	test('It should not sign in and display error with invalid credentials', async ({ app }) => {
		await app.signIn.enterEmail('invalid@invalid.com');
		await app.signIn.enterPassword('invalidPassword');
		await app.signIn.signIn();

		await app.signIn.shouldDisplayAuthenticationError();
	});

	test('It should have "Sign In" button disabled if username or password are missing', async ({
		app,
	}) => {
		await app.signIn.shouldHaveSignInButtonDisabled();

		await app.signIn.enterEmail('aaa');
		await app.signIn.shouldHaveSignInButtonDisabled();

		await app.signIn.enterPassword('bbb');
		await app.signIn.shouldHaveSignInButtonEnabled();

		await app.signIn.clearInputField('email');
		await app.signIn.shouldHaveSignInButtonDisabled();
	});
});
