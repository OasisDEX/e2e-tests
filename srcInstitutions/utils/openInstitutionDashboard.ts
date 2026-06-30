import { App } from 'srcInstitutions/app';

export const openInstitutionDashboard = async ({
	app,
	institution,
}: {
	app: App;
	institution: string;
}) => {
	await app.adminOverview.openInstitution(institution);

	await app.clientDashboard.shouldBeVisible();
};
