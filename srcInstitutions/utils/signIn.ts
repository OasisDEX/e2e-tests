import { App } from 'srcInstitutions/app';

export const adminUsername = process.env.INSTITUTIONS_ADMIN_USERNAME ?? 'no-username-provided';
export const adminPassword = process.env.INSTITUTIONS_ADMIN_PASSWORD ?? 'no-password-provided';
export const clientUsername = process.env.INSTITUTIONS_CLIENT_USERNAME ?? 'no-username-provided';
export const clientPassword = process.env.INSTITUTIONS_CLIENT_PASSWORD ?? 'no-password-provided';
export const clientMfaUsername =
	process.env.INSTITUTIONS_CLIENT_MFA_USERNAME ?? 'no-username-provided';
export const clientMfaPassword =
	process.env.INSTITUTIONS_CLIENT_MFA_PASSWORD ?? 'no-password-provided';
export const adminMfaUsername =
	process.env.INSTITUTIONS_ADMIN_MFA_USERNAME ?? 'no-username-provided';
export const adminMfaPassword =
	process.env.INSTITUTIONS_ADMIN_MFA_PASSWORD ?? 'no-password-provided';

export const signIn = async ({ app, userRights }: { app: App; userRights: 'admin' | 'client' }) => {
	await app.signIn.enterEmail(userRights === 'admin' ? adminUsername : clientUsername);
	await app.signIn.enterPassword(userRights === 'admin' ? adminPassword : clientPassword);
	await app.signIn.signIn();

	if (userRights === 'admin') {
		await app.adminOverview.shouldBeVisible();
	} else {
		await app.clientDashboard.shouldBeVisible();
	}
};
