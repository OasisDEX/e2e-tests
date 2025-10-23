import { App } from 'srcInstitutions/app';
import { Roles } from './types';

export const adminUsername = process.env.INSTITUTIONS_ADMIN_USERNAME ?? 'no-username-provided';
export const adminPassword = process.env.INSTITUTIONS_ADMIN_PASSWORD ?? 'no-password-provided';
export const adminMfaUsername =
	process.env.INSTITUTIONS_ADMIN_MFA_USERNAME ?? 'no-username-provided';
export const adminMfaPassword =
	process.env.INSTITUTIONS_ADMIN_MFA_PASSWORD ?? 'no-password-provided';

export const clientViewerUsername =
	process.env.INSTITUTIONS_CLIENT_USERNAME ?? 'no-username-provided';
export const clientViewerPassword =
	process.env.INSTITUTIONS_CLIENT_PASSWORD ?? 'no-password-provided';
export const clientRoleAdminUsername =
	process.env.INSTITUTIONS_CLIENT_ROLEADMIN_USERNAME ?? 'no-username-provided';
export const clientRoleAdminPassword =
	process.env.INSTITUTIONS_CLIENT_ROLEADMIN_PASSWORD ?? 'no-password-provided';
export const clientMfaUsername =
	process.env.INSTITUTIONS_CLIENT_MFA_USERNAME ?? 'no-username-provided';
export const clientMfaPassword =
	process.env.INSTITUTIONS_CLIENT_MFA_PASSWORD ?? 'no-password-provided';

export const signIn = async ({
	app,
	userRights,
	role,
}: {
	app: App;
	userRights: 'admin' | 'client';
	role?: Roles;
}) => {
	await app.signIn.enterEmail(
		userRights === 'admin'
			? adminUsername
			: role && role === 'Viewer'
			? clientViewerUsername
			: clientRoleAdminUsername
	);
	await app.signIn.enterPassword(
		userRights === 'admin'
			? adminPassword
			: role && role === 'Viewer'
			? clientViewerPassword
			: clientRoleAdminPassword
	);
	await app.signIn.signIn();

	if (userRights === 'admin') {
		await app.adminOverview.shouldBeVisible();
	} else {
		await app.clientDashboard.shouldBeVisible();
	}
};
