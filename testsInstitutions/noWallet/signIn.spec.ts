import { test } from '#institutionsFixtures';
import {
	adminPassword,
	adminUsername,
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

	test('It should sign in with valid credentials - Client', async ({ app }) => {
		await app.signIn.enterEmail(clientUsername);
		await app.signIn.enterPassword(clientPassword);
		await app.signIn.signIn();

		await app.clientOverview.shouldBeVisible();
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
